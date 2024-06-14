import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageItem } from 'src/user/image.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { TagService } from 'src/tag/tag.service';
import { BaseFilter } from 'src/untils/base-filter.dto';
import { renderQueryPaging } from 'src/helper/generatePaging';
import { renderVoteQuery } from 'src/helper/renderVoteQuery';
import { ArticleVote } from './entities/article-vote.entity';
import { fileValidator } from 'src/helper/fileValidator';
import { S3Service } from 'src/s3/s3.service';
import { UserFollower } from 'src/user/userFollower.entity';
import { FilterTime } from 'src/types/BaseType';
import { renderFilterTimeQuery } from 'src/helper/renderFilderTime';
import { ArticleReport } from './entities/article-report.entity';
import { CreateReportDto } from 'src/create-report.dto';
import { ReportQuery } from 'src/untils/ReportQuery.dto';
import { NotificationService } from 'src/notification/notification.service';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { UserService } from 'src/user/user.service';
import { Comment } from 'src/comment-socket/entities/comment-socket.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article) private readonly articleRepository: Repository<Article>,
    @InjectRepository(ImageItem) private readonly imageItemRepository: Repository<ImageItem>,
    @InjectRepository(ArticleVote) private readonly voteRepository: Repository<ArticleVote>,
    @InjectRepository(ArticleReport) private readonly articleReportRepository: Repository<ArticleReport>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    private readonly s3Service: S3Service,
    private readonly tagService: TagService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) { }

  async createArticle(authorId: number, createArticleDto: CreateArticleDto, thumbnailPath: string): Promise<Article> {

    const checkAuthor = await this.userService.getDetailUser(false, authorId);

    if (checkAuthor.status === 0) {
      throw new HttpException("Account is locked from writing posts", HttpStatus.FORBIDDEN)
    }

    let image = null;
    if (thumbnailPath) {
      const newImageItem = this.imageItemRepository.create({
        path: thumbnailPath,
        isAvatar: 0,
        author: { id: authorId },
      });

      image = await this.imageItemRepository.save(newImageItem);
    }
    const tagIds: string[] = createArticleDto.tag.split(',');

    const tags: Tag[] = [];
    for (let i = 0; i < tagIds.length; i++) {

      await this.tagRepository.createQueryBuilder()
        .update()
        .set({ numberUse: () => "numberUse + 1" })
        .where("id = :id", { id: +tagIds[i] })
        .execute();

      const tag = await this.tagService.findOneTag(parseInt(tagIds[i]));

      if (tag) {
        await this.tagRepository.save(tag);
        tags.push(tag);
      }
    }

    const newArticle = this.articleRepository.create({
      ...createArticleDto,
      author: { id: authorId },
      tags: tags,
      thumbnail: image ? image.path : null
    });

    return this.articleRepository.save(newArticle);
  }

  async findAllArticle(query: BaseFilter, req: any): Promise<[Article[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);
    const searchTerm = query.search || undefined;
    const userId = query.userId || undefined;
    const tagId = query.tag || undefined;
    const seriesId = query.seriesId || undefined;
    const notIn = query.notIn || undefined;
    const status = query.status || undefined;

    let isAdmin = false;

    if (req && req.user && req.user.role === "ADMIN") {
      isAdmin = true;
    }

    const queryBuilder = this.articleRepository.createQueryBuilder("article");

    if (searchTerm !== undefined) {
      queryBuilder.where("(article.title LIKE :searchTerm OR article.body LIKE :searchTerm OR article.keyword LIKE :searchTerm)", { searchTerm: `%${searchTerm}%` });
    }

    if (userId !== undefined) {
      queryBuilder.andWhere("article.userId = :userId", { userId });
    }

    if (tagId !== undefined) {
      queryBuilder.innerJoinAndSelect("article.tags", "tags", "tags.id = :tagId", { tagId });
    } else {
      queryBuilder.leftJoin("article.tags", "tags");
    }

    if (seriesId !== undefined) {
      queryBuilder.andWhere('article.seriesId = :seriesId', { seriesId });
      queryBuilder.orderBy("seriesId", 'ASC');
    }

    if (notIn !== undefined) {
      const idsToExclude = notIn.split(',').map(id => parseInt(id, 10));
      queryBuilder.andWhere('article.id NOT IN (:...ids)', { ids: idsToExclude });
    }

    if (status) {
      queryBuilder.andWhere("article.status = :status", { status });
    }

    if (!isAdmin && !(req.userData && userId && +req.userData.id === +userId)) {
      queryBuilder.andWhere('article.status = 1');
    }

    queryBuilder.leftJoinAndSelect("article.author", "author");

    if (!isAdmin) {
      queryBuilder.andWhere("author.isDelete = 0");
    }

    queryBuilder.orderBy("article.createdAt", "DESC")
      .take(itemPerPage)
      .skip(skip)
      .select(
        [
          "article.id", "article.title", "article.thumbnail", "article.keyword", "article.vote", "article.view", 'article.status', 'article.countComment',
          "article.description", "article.createdAt", "author.id", "author.email", "author.first_name", "author.last_name", "author.avatarPath", "tags"
        ]
      );

    const [res, total] = await queryBuilder.getManyAndCount();
    return [res, total];
  }

  async getCountArticle(query: FilterTime) {
    const { time, from, to } = query;

    const queryBuilder = this.articleRepository.createQueryBuilder();

    renderFilterTimeQuery(queryBuilder, time, from, to);

    const total = await queryBuilder.getCount();
    return total
  }

  async counterView(id: string) {
    await this.articleRepository.createQueryBuilder()
      .update()
      .set({ view: () => "view +1" })
      .where("id = :id and status=1", { id })
      .execute();
  }

  async findOneArticle(id: number, userId: number | null = null): Promise<Article> {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.tags', 'tags')
      .leftJoin('article.author', 'author')
      .select(['article.id', 'article.title', 'article.body', 'article.countComment',
        'article.keyword', 'article.view', 'article.vote', 'article.description', 'article.thumbnail', 'article.createdAt', 'article.status',
        'author.id', 'author.first_name', 'author.last_name', 'author.email', 'author.avatarPath', 'tags.id', 'tags.tagName'])
      .where('article.id = :id', { id });

    if (userId != null) {
      query.andWhere('author.id = :userId', { userId });
    } else {
      query.andWhere('article.status = 1');
    }

    const article = await query.getOne();

    if (!article) {
      throw new HttpException("Article not found", HttpStatus.NOT_FOUND);
    }
    return article;
  }

  async handleVote(type: "upvote" | "downvote", state: "upvote" | "downvote" | "-", articleId: number, userId: number) {

    const voteQuery = renderVoteQuery(type, state);

    await this.articleRepository.createQueryBuilder()
      .update()
      .set({ vote: () => voteQuery })
      .where("id = :id", { id: articleId })
      .execute();

    const check = await this.voteRepository.findOneBy({
      articleId, userId
    });

    if (state === type) {
      if (check) {
        await this.voteRepository.delete({ id: check.id });
      }
    } else {
      if (check) {
        this.voteRepository.update(
          { id: check.id },
          { voteType: type }
        )
      } else {
        this.voteRepository.save({
          userId: userId,
          articleId: articleId,
          voteType: type
        });
      }
    }
  }

  ckUpload(author: number, url: string) {
    const newImageItem = this.imageItemRepository.create({
      path: url,
      isAvatar: 0,
      author: { id: author },
    });

    this.imageItemRepository.save(newImageItem);
  }

  async getVotedArticle(userId: number, articleId: number) {
    const check = await this.voteRepository.findOneBy({
      articleId: articleId,
      userId: userId
    });

    return check;
  }

  async getArticleFlowing(userId: number, query: BaseFilter): Promise<[Article[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);

    const queryBuilder = this.articleRepository.createQueryBuilder('article')
      .innerJoin("article.author", "author")
      .innerJoin('article.tags', 'tags')
      .innerJoin(UserFollower, "follows", "author.id = follows.followingId")
      .select(['article.id', 'article.title', 'article.keyword', 'article.view', 'article.vote', 'article.countComment',
        'article.description', 'article.thumbnail', 'article.createdAt', 'author.id', 'author.first_name', 'author.email',
        'author.last_name', 'author.avatarPath', 'tags.id', 'tags.tagName'])
      .where("follows.followerId = :userId", { userId })
      .andWhere("author.isDelete = 0")
      .andWhere('article.status = 1')
      .orderBy("article.createdAt", "DESC")
      .take(itemPerPage)
      .skip(skip)


    const [posts, total] = await queryBuilder.getManyAndCount();

    return [posts, total];
  }

  async update(userId: number, id: number, updateArticleDto: UpdateArticleDto, thumbnail: Express.Multer.File) {
    // Lấy ra bài viết từ cơ sở dữ liệu
    const article = await this.articleRepository
      .createQueryBuilder("article")
      .where("article.id = :id", { id: id })
      .getOne();

    if (!article) {
      throw new HttpException("Không tìm thấy bài viết", HttpStatus.NOT_FOUND);
    }

    if (article.userId !== userId) {
      throw new HttpException("Permission denied", HttpStatus.FORBIDDEN)
    }

    //lấy ra các tag theo quan hệ
    const actualRelationships = await this.articleRepository
      .createQueryBuilder()
      .relation(Article, "tags")
      .of(article)
      .loadMany();


    let thumbnailPath = article.thumbnail || '';

    const tagIds: string[] = updateArticleDto.tag.split(',');

    const tags: Tag[] = [];
    for (let i = 0; i < tagIds.length; i++) {
      let tag = await this.tagService.findOneTag(parseInt(tagIds[i]));
      if (!tag) {
        throw new Error(`Không tìm thấy tag với ID: ${tagIds[i]}`);
      }
      tags.push(tag);
    }

    //Cập nhật tag, xóa và thêm mới
    await this.articleRepository
      .createQueryBuilder()
      .relation(Article, "tags")
      .of(article)
      .addAndRemove(tags, actualRelationships);

    //Cập nhật ảnh thumbnail nếu có ảnh mới
    if (thumbnail) {
      if (fileValidator(thumbnail)) {
        thumbnailPath = await this.s3Service.uploadFile(thumbnail);
        console.log("thumbnail", thumbnailPath);
      }
    }

    //Cập nhật bài viết
    const { tag, ...data } = updateArticleDto;
    return await this.articleRepository.save({ ...article, ...data, thumbnail: thumbnailPath });
  }

  async updateStatus(id: number, status: 1 | 2) {
    const checkArticle = await this.articleRepository.findOneBy({ id });

    if (!checkArticle) {
      throw new HttpException(`Article Not Found With Id: ${id}`, HttpStatus.NOT_FOUND);
    }

    return await this.articleRepository.save({
      ...checkArticle,
      status
    });

  }

  async updateSeries(userId: number, articleId: number, query: any) {
    let { seriesId, numberOder, type } = query;

    const article = await this.articleRepository.createQueryBuilder("article")
      .innerJoin("article.author", "author")
      .select(
        [
          'article.id', 'article.title', 'article.keyword', 'article.view', 'article.vote',
          'article.description', 'article.thumbnail', 'article.createdAt',
          'article.seriesId', 'article.numberOder',
          "article", 'author.id', 'author.first_name', 'author.last_name'
        ])
      .where("article.id = :articleId", { articleId })
      .andWhere("article.userId = :userId", { userId })
      .getOne();

    if (!article) {
      throw new HttpException("Article Not Found", HttpStatus.NOT_FOUND);
    }

    if (type === "delete") {
      numberOder = null;
      seriesId = null;
    }
    const updateSeries = Object.assign(article, { seriesId, numberOder });
    const resultUpdate = await this.articleRepository.save(updateSeries);
    return resultUpdate;
  }

  async remove(id: number) {
    const checkArticle = await this.articleRepository.findOneBy({ id });

    if (!checkArticle) {
      throw new HttpException(`Article Not Found With Id: ${id}`, HttpStatus.NOT_FOUND);
    }

    const actualRelationships = await this.articleRepository
      .createQueryBuilder()
      .relation(Article, "tags")
      .of(checkArticle)
      .loadMany();

    await this.articleRepository
      .createQueryBuilder()
      .relation(Article, "tags")
      .of(checkArticle)
      .addAndRemove([], actualRelationships);

    return await this.articleRepository.delete({
      id
    });
  }

  //for report
  private async getArticleInfo(id: number) {
    const article = await this.articleRepository.createQueryBuilder("article")
      .where({ id })
      .select(["article.userId", "article.title"])
      .getOne();
    return article;
  }

  async createReport(userId, articleId: number, createReportDto: CreateReportDto) {
    const newReport = await this.articleReportRepository.create({
      ...createReportDto,
      authorId: userId,
      articleId
    });

    const articleInfo = await this.getArticleInfo(articleId);

    const result = await this.articleReportRepository.save(newReport);

    const notification: CreateNotificationDto = {
      content: `Có một báo cáo vi phạm của bài viết: "${articleInfo.title}"`,
      relatedId: result.id,
      toAllUsers: 'ADMIN',
      type: "REPORT_ARTICLE"
    }

    await this.notificationService.create(notification);

    return result;
  }

  async getReport(query: ReportQuery): Promise<[total: ArticleReport[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);

    const queryBuilder = this.articleReportRepository.createQueryBuilder("report");

    //tìm kiếm theo thời gian
    const { from, to } = query;
    renderFilterTimeQuery(queryBuilder, from, to, "report");

    const { search, articleId } = query;

    queryBuilder.innerJoin("report.author", "author");

    queryBuilder.innerJoin("report.article", "article");
    //tìm kiếm theo note, title bài viết
    if (search) {
      queryBuilder.where(
        "report.note ilike :search or article.title ilike :search",
        { search: `%${search}%` });
    }

    //tìm kiếm theo bài viết bị report
    if (articleId) {
      queryBuilder.andWhere("article.id = :articleId", { articleId });
    }

    queryBuilder.select([
      "report.id", "report.reason", "report.createdAt", "report.status", "report.note",
      "author.first_name", "author.last_name", "author.avatarPath", "author.email", "author.id",
      "article.id", "article.title", "article.createdAt", "article.thumbnail"
    ])
      .take(itemPerPage)
      .skip(skip)
      .orderBy("report.createdAt", "DESC");

    const [res, total] = await queryBuilder.getManyAndCount();

    return [res, total];
  }

  //Lấy chi tiết một report
  async getDetailReport(reportId: number) {
    const queryBuilder = this.articleReportRepository.createQueryBuilder("report")
      .innerJoin("report.author", "author")
      .innerJoin("report.article", "article")
      .select([
        "report.id", "report.reason", "report.createdAt", "report.status", "report.note",
        "author.first_name", "author.last_name", "author.avatarPath", "author.email", "author.id",
        "article.id", "article.title", "article.createdAt", "article.thumbnail",
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

  //update report status
  async updateStatusReport(reportId: number, status: number) {
    const oldReport = await this.articleReportRepository.findOneBy({
      id: reportId
    });

    if (!oldReport) {
      throw new HttpException(`Report not found with id: ${reportId}`, HttpStatus.NOT_FOUND);
    }

    const articleId = oldReport.articleId;

    const articleInfo = await this.findOneArticle(articleId);

    if (status === 1) {

    } else if (status === 2) { //gỡ bài
      await this.articleRepository.update(
        { id: articleId },

        {
          status: 2 //block
        });

      const notification1: CreateNotificationDto = {
        recipientId: articleInfo.author.id,
        content: `<p>Chúng tôi đã ẩn bài viết: <b>${articleInfo.title}</b> của bạn do vi phạm tiêu chuẩn cộng đồng</p>`,
        relatedId: oldReport.id,
        contentDetail:
          `
          <div class='row'>
            <p>Chúng tôi đã nhận được một số phản án về bài viết của bạn đã vi phạm tiêu chuẩn cộng đông, sau khi kiểm tra và xem xét, chúng tôi rất tiếc phải gỡ nội dung bài viết của bạn.</p>
            <p><b>Tiêu đề bài viết: </b> <b>${articleInfo.title}</b></p>
            <p>Bạn vẫn có thể tìm kiếm bài viết trong trang cá nhân của bạn, nhưng bài viết sẽ không được hiển thị với người khác</p>
            <p><b>Viblo</b> xin lỗi vì sự bất tiện này</p>
          </div>
          `,
        toAllUsers: "PERSONAL",
        type: "REPORT_RESULT"
      }

      const notification2: CreateNotificationDto = {
        recipientId: oldReport.authorId,
        content: `<p>Kết quả báo cáo của bạn về bài viết của: <b>${articleInfo.author.first_name} ${articleInfo.author.last_name}</b></p>`,
        relatedId: oldReport.id,
        contentDetail:
          `
          <div class='row'>
            <p>Chúng tôi đã nhận được một số phản án về  báo cáo của bạn về bài viết của <b>${articleInfo.author.first_name} ${articleInfo.author.last_name}</b> vi tiêu chuẩn cộng đông, sau khi kiểm tra và xem xét, chúng tôi đã gỡ nội dung bài viết trên.</p>
            <p><b>Tiêu đề bài viết: </b> ${articleInfo.title}</p>
            <p><b>Viblo</b> xin cảm ơn vì những đóng góp của bạn</p>
          </div>
          `,
        toAllUsers: "PERSONAL",
        type: "REPORT_RESULT"
      }

      await this.notificationService.create(notification1);
      await this.notificationService.create(notification2);

    } else if (status === 3) { //Không vi phạm
      await this.articleRepository.update(
        { id: articleId },

        {
          status: 1
        });

      const notification: CreateNotificationDto = {
        recipientId: oldReport.authorId,
        content: `<p>Kết quả báo cáo của bạn về bài viết của: <b>${articleInfo.author.first_name} ${articleInfo.author.last_name}</b></p>`,
        relatedId: oldReport.id,
        contentDetail:
          `
              <div class='row'>
                <p>Chúng tôi đã nhận được một số phản án về  báo cáo của bạn về  bài viết của <b>${articleInfo.author.first_name} ${articleInfo.author.last_name}</b> vi phạm tiêu chuẩn cộng đông, tuy nhiên sau khi kiểm tra và xem xét kỹ lưỡng, chúng tôi nhận thấy nội dung trên không vi phạm các tiêu chuẩn cộng đồng.</p>
                <p><b>Tiêu đề bài viết: </b> ${articleInfo.title}</p>
                <p><b>Viblo</b> xin cảm ơn vì những đóng góp của bạn</p>
              </div>
              `,
        toAllUsers: "PERSONAL",
        type: "REPORT_RESULT"
      }

      await this.notificationService.create(notification);
    } else {
      throw new HttpException("Bad request exception", HttpStatus.BAD_REQUEST)
    }

    const reportUpdated = await this.articleReportRepository.save({ ...oldReport, status });

    return reportUpdated;

  }

}
