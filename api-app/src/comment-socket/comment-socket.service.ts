import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentSocketDto } from './dto/create-comment-socket.dto';
import { UpdateCommentSocketDto } from './dto/update-comment-socket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment-socket.entity';
import { Repository } from 'typeorm';
import { BaseFilter } from 'src/untils/base-filter.dto';
import { renderPagingResponse, renderQueryPaging } from 'src/helper/generatePaging';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { CommentVote } from './entities/comment-vote.entity';
import { renderVoteQuery } from 'src/helper/renderVoteQuery';
import { CreateReportDto } from 'src/create-report.dto';
import { CommentReport } from './entities/comment-report.entity';
import { ReportQuery } from 'src/untils/ReportQuery.dto';
import { renderFilterTimeQuery } from 'src/helper/renderFilderTime';
import { NotificationService } from 'src/notification/notification.service';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { ArticlesService } from 'src/articles/articles.service';
import { Article } from 'src/articles/entities/article.entity';

@Injectable()
export class CommentSocketService {

  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(CommentVote) private commentVoteRepository: Repository<CommentVote>,
    @InjectRepository(CommentReport) private reportCommentRepository: Repository<CommentReport>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    private readonly notificationService: NotificationService,
    private readonly articlesService: ArticlesService,
  ) { }


  async counterComment(id: number) {
    await this.articleRepository.createQueryBuilder()
      .update()
      .set({ countComment: () => "count_comment +1" })
      .where("id = :id", { id })
      .execute();
  }

  async createComment(createCommentSocketDto: CreateCommentSocketDto, authorId: number): Promise<Comment> {

    await this.counterComment(createCommentSocketDto.articleId);

    const newComment = await this.commentRepository.create({
      ...createCommentSocketDto,
      authorId: authorId
    });

    const dataSaved = await this.commentRepository.save(newComment);
    const result = await this.findOne(dataSaved.id);

    const articleData = await this.articlesService.findOneArticle(result.articleId);

    if (result.parentId) {
      const commentParent = await this.findOne(result.parentId);
      console.log("Check reply");
      const newNotification: CreateNotificationDto = {
        recipientId: commentParent.authorId,
        content: `${result.author.first_name} ${result.author.last_name} Đã trả lời bình luận của bạn của bạn`,
        relatedId: result.articleId,
        toAllUsers: 'PERSONAL',
        type: "REPLY_COMMENT"
      }

      this.notificationService.create(newNotification)
    }

    if (result.authorId != articleData.author.id) {
      const newNotification: CreateNotificationDto = {
        recipientId: articleData.author.id,
        content: `${result.author.first_name} ${result.author.last_name} Đã bình luận về bài viết của bạn`,
        relatedId: result.articleId,
        toAllUsers: 'PERSONAL',
        type: "COMMENT"
      }
      this.notificationService.create(newNotification)
    }

    return result;
  }

  async findAllComment(query: BaseFilter): Promise<[comments: ResponseCommentDto[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);

    //Lấy ra tổng bình luận
    const total = await this.commentRepository.countBy({ articleId: query.articleId });

    //Lấy ra các bình luận cha
    const res = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.author', 'author')
      .select(['comment', 'author.avatarPath', 'author.first_name', 'author.last_name', 'author.email'])
      .where('comment.parentId IS NULL')
      .andWhere('comment.articleId = :articleId', { articleId: query.articleId })
      .andWhere('comment.status = 1')
      .orderBy('comment.createdAt', 'DESC')
      .take(itemPerPage)
      .skip(skip)
      .getMany();

    const response: ResponseCommentDto[] = res.map(comment => {
      // Map thông tin comment vào ResponseCommentDto
      const responseCommentDto: ResponseCommentDto = {
        comment: comment,
        paginationChild: null,
        children: []
      };

      return responseCommentDto;
    });

    //Lấy ra comment con nếu có
    await Promise.all(response.map(async (comment, index) => {
      const [childComments, childCommentsCount] = await this.findChildComment(comment.comment.id, 5, 1);
      response[index].children = childComments;
      response[index].paginationChild = renderPagingResponse(5, 1, childCommentsCount);
    }));
    return [response, total];
  }

  //Lấy ra các comment con
  async findChildComment(parentId: number, itemPerPage, page): Promise<[comments: Comment[], total: number]> {

    const skip = (page - 1) * itemPerPage;
    const [res, total] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.author', 'author')
      .select(['comment', 'author.avatarPath', 'author.first_name', 'author.last_name', 'author.email'])
      .where('comment.parentId = :parentId', { parentId })
      .andWhere('comment.status = 1')
      .orderBy('comment.createdAt', 'DESC')
      .take(itemPerPage)
      .skip(skip)
      .getManyAndCount();

    return [res, total];
  }

  //Lấy ra một comment
  async findOne(id: number) {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.author', 'author')
      .leftJoin('comment.article', 'article')
      .select(['comment', 'author.avatarPath', 'author.first_name', 'author.last_name', 'article.title'])
      .where('comment.id = :id', { id })
      .getOne();
  }

  //Xử lý vote comment
  async handleVote(type: "upvote" | "downvote", state: "upvote" | "downvote" | "-", commentId: number, userId: number) {

    const voteQuery = renderVoteQuery(type, state);

    await this.commentRepository.createQueryBuilder()
      .update()
      .set({ vote: () => voteQuery })
      .where("id = :id", { id: commentId })
      .execute();

    const check = await this.commentVoteRepository.findOneBy({
      commentId, userId
    });

    if (state === type) {
      if (check) {
        //Nếu bỏ vote thì xóa thông tin vote
        await this.commentVoteRepository.delete({ id: check.id });
      }
    } else {
      if (check) {
        this.commentVoteRepository.update(
          { id: check.id },
          { voteType: type }
        )
      } else {
        this.commentVoteRepository.save({
          userId: userId,
          commentId: commentId,
          voteType: type
        });
      }
    }
  }

  //Lấy chi tiết vote của comment (kiểm tra xem user đã vote hay chưa và trạng thái là up hay down)
  async getVotedComment(userId: number, commentId: number): Promise<CommentVote> {
    const check = await this.commentVoteRepository.findOneBy({
      commentId: commentId,
      userId: userId
    });

    return check;
  }

  update(id: number, updateCommentSocketDto: UpdateCommentSocketDto) {
    return `This action updates a #${id} commentSocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentSocket`;
  }


  //for report
  async createReport(userId, commentId: number, createReportDto: CreateReportDto) {

    const newReport = await this.reportCommentRepository.create({
      ...createReportDto,
      authorId: userId,
      commentId
    });

    const result = await this.reportCommentRepository.save(newReport);

    const commentInfo = await this.findOne(commentId);

    const notification: CreateNotificationDto = {
      content: `Có một báo cáo bình luận vi phạm của bài: "${commentInfo.article.title}"`,
      relatedId: result.id,
      toAllUsers: 'ADMIN',
      type: "REPORT_COMMENT"
    }

    await this.notificationService.create(notification);

    return result;
  }

  async getReport(query: ReportQuery): Promise<[total: CommentReport[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);

    const queryBuilder = this.reportCommentRepository.createQueryBuilder("report");

    //tìm kiếm theo thời gian
    const { from, to } = query;
    renderFilterTimeQuery(queryBuilder, from, to, "report");

    const { search, commentId } = query;

    queryBuilder.innerJoin("report.author", "author");

    queryBuilder.innerJoin("report.comment", "comment");
    //tìm kiếm theo note, title bài viết
    if (search) {
      queryBuilder.where(
        "report.note ilike :search or article.title ilike :search",
        { search: `%${search}%` });
    }

    //tìm kiếm theo bài viết bị report
    if (commentId) {
      queryBuilder.andWhere("comment.id = :commentId", { commentId });
    }

    queryBuilder.select([
      "report.id", "report.reason", "report.createdAt", "report.status", "report.note",
      "author.first_name", "author.last_name", "author.avatarPath", "author.email", "author.id",
      "comment.id", "comment.content"
    ])
      .take(itemPerPage)
      .skip(skip)
      .orderBy("report.createdAt", "DESC");

    const [res, total] = await queryBuilder.getManyAndCount();

    return [res, total];
  }

  async getDetailReport(reportId: number) {
    const queryBuilder = this.reportCommentRepository.createQueryBuilder("report")
      .innerJoin("report.author", "author")
      .innerJoin("report.comment", "comment")
      .select([
        "report.id", "report.reason", "report.createdAt", "report.status", "report.note",
        "author.first_name", "author.last_name", "author.avatarPath", "author.email", "author.id",
        "comment.id", "comment.content"
      ])
      .where({
        id: reportId
      });

    const result = queryBuilder.getOneOrFail();

    if (!result) {
      throw new HttpException("Report not found", HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateStatusReport(reportId: number, data: any) {
    const { status } = data;
    const oldReport = await this.reportCommentRepository.findOneByOrFail({
      id: reportId
    });

    if (!oldReport) {
      throw new HttpException(`Report not found with id: ${reportId}`, HttpStatus.NOT_FOUND);
    }

    const commentId = oldReport.commentId;

    const commentInfo = await this.findOne(commentId);

    //TODO: Send mail status report
    if (status === 1) {

    } else if (status === 2) { //yêu cầ chỉnh sửa
      await this.commentRepository.update(
        { id: commentId },
        {
          status: 2
        });

      const notification1: CreateNotificationDto = {
        recipientId: commentInfo.authorId,
        content: `<p>Chúng tôi đã ẩn bình luận của bạn do vi phạm tiêu chuẩn cộng đồng trong bài viết: <b>${commentInfo.article.title}</b></p>`,
        relatedId: oldReport.id,
        contentDetail:
          `
          <div class='row'>
            <p>Chúng tôi đã nhận được một số phản án về bình luận của bạn đã vi phạm tiêu chuẩn cộng đông, sau khi kiểm tra và xem xét, chúng tôi rất tiếc phải gỡ nội dung bình luận của bạn.</p>
            <p><b>Nội dung bình luận: </b> ${commentInfo.content}</p>
            <p><b>Viblo</b> xin lỗi vì sự bất tiện này</p>
          </div>
          `,
        toAllUsers: "PERSONAL",
        type: "REPORT_RESULT"
      }

      const notification2: CreateNotificationDto = {
        recipientId: oldReport.authorId,
        content: `<p>Kết quả báo cáo của bạn về bài viết của: <b>${commentInfo.author.first_name} ${commentInfo.author.last_name}</b></p>`,
        relatedId: oldReport.id,
        contentDetail:
          `
          <div class='row'>
            <p>Chúng tôi đã nhận được một số phản án về  báo cáo của bạn về bình luận của <b>${commentInfo.author.first_name} ${commentInfo.author.last_name}</b> vi tiêu chuẩn cộng đông, sau khi kiểm tra và xem xét, chúng tôi đã gỡ nội dung bình luận trên.</p>
            <p><b>Nội dung bình luận: </b> ${commentInfo.content}</p>
            <p><b>Viblo</b> xin cảm ơn vì những đóng góp của bạn</p>
          </div>
          `,
        toAllUsers: "PERSONAL",
        type: "REPORT_RESULT"
      }

      await this.notificationService.create(notification1);
      await this.notificationService.create(notification2);
      //TODO: Send mail status report
    } else if (status === 3) { //Không vi phạm
      await this.commentRepository.update(
        { id: commentId },
        {
          status: 1
        })

      const notification1: CreateNotificationDto = {
        recipientId: oldReport.authorId,
        content: `<p>Kết quả báo cáo của bạn về bình luận của: <b>${commentInfo.author.first_name} ${commentInfo.author.last_name}</b></p>`,
        relatedId: oldReport.id,
        contentDetail:
          `
            <div class='row'>
              <p>Chúng tôi đã nhận được một số phản án về  báo cáo của bạn về bình luận của <b>${commentInfo.author.first_name} ${commentInfo.author.last_name}</b> v phạm tiêu chuẩn cộng đông, tuy nhiên sau khi kiểm tra và xem xét kỹ lưỡng, chúng tôi nhận thấy nội dung trên không vi phạm các tiêu chuẩn cộng đồng.</p>
              <p><b>Nội dung bình luận: </b> ${commentInfo.content}</p>
              <p><b>Viblo</b> xin cảm ơn vì những đóng góp của bạn</p>
            </div>
            `,
        toAllUsers: "PERSONAL",
        type: "REPORT_RESULT"
      }

      await this.notificationService.create(notification1);

    } else {
      throw new HttpException("Bad request exception", HttpStatus.BAD_REQUEST)
    }

    const reportUpdated = await this.reportCommentRepository.save({ ...oldReport, status });

    return reportUpdated;
  }
}
