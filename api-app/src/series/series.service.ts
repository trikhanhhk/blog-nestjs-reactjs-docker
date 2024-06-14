import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Series } from './entities/series.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { renderQueryPaging } from 'src/helper/generatePaging';
import { BaseFilter } from 'src/untils/base-filter.dto';
import { renderVoteQuery } from 'src/helper/renderVoteQuery';
import { SeriesVote } from './entities/series-vote.entity';
import { FilterTime } from 'src/types/BaseType';
import { renderFilterTimeQuery } from 'src/helper/renderFilderTime';
import { ReportQuery } from 'src/untils/ReportQuery.dto';
import { CreateReportDto } from 'src/create-report.dto';
import { SeriesReport } from './entities/series-report.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series) private readonly seriesRepository: Repository<Series>,
    @InjectRepository(SeriesVote) private readonly voteRepository: Repository<SeriesVote>,
    @InjectRepository(SeriesReport) private readonly reportSeriesRepository: Repository<SeriesReport>
  ) { }

  async create(authorId: number, createSeriesDto: CreateSeriesDto): Promise<Series> {
    console.log("Create Series DTO", createSeriesDto);
    const series = await this.seriesRepository.save({
      ...createSeriesDto,
      author: { id: authorId }
    });
    return series;
  }

  async findAll(isAdmin: boolean, query: BaseFilter): Promise<[series: Series[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);
    const searchTerm = query.search || undefined;
    const userId = query.userId || undefined;

    const queryBuilder = this.seriesRepository.createQueryBuilder("series")
      .innerJoin("series.author", "author")
      .select(["series.id", "series.title", "series.description", "series.createdAt", "series.view", "author.id", "author.email", "author.first_name", "author.last_name", "author.avatarPath"]);

    if (searchTerm && searchTerm != '') {
      queryBuilder.where("(series.title ILIKE :searchTerm OR series.description ILIKE :searchTerm)", { searchTerm: `%${searchTerm}%` });
    }

    if (!userId && !isAdmin) { //phải có ít nhất một bài viết thì mới hiển thị trên trang chủ
      queryBuilder.innerJoin("series.articles", "article")

    } else {
      if (userId) {
        queryBuilder.andWhere("author.id = :userId", { userId })
      }
    }

    if (!isAdmin) {
      queryBuilder.andWhere("author.isDelete = 0");
    }

    queryBuilder.take(itemPerPage).skip(skip)
    queryBuilder.orderBy('series.createdAt', 'DESC');

    const [res, total] = await queryBuilder.getManyAndCount();
    return [res, total];
  }

  async countSeries(
    query: FilterTime
  ) {
    const { time, from, to } = query;

    const queryBuilder = this.seriesRepository.createQueryBuilder();

    renderFilterTimeQuery(queryBuilder, time, from, to);

    const total = await queryBuilder.getCount();
    return total
  }

  async counterView(id: number) {
    await this.seriesRepository.createQueryBuilder()
      .update()
      .set({ view: () => "view +1" })
      .where("id = :id", { id })
      .execute();
  }

  async findOne(id: number) {
    const series = await this.seriesRepository.createQueryBuilder("series")
      .leftJoin("series.author", "author")
      .select(["series", "author.id", "author.first_name", "author.last_name", "author.avatarPath"])
      .where("series.id = :id", { id })
      .getOne();

    if (!series) {
      throw new HttpException(`Series not found with id: ${id}`, HttpStatus.NOT_FOUND);
    }

    return series;
  }


  async update(authorId: number, id: number, updateSeriesDto: UpdateSeriesDto) {

    const oldSeries = await this.seriesRepository.findOneBy({
      id
    });

    if (!oldSeries) {
      throw new HttpException("Series not found", HttpStatus.NOT_FOUND);
    }

    if (oldSeries.authorId != authorId) {
      throw new HttpException("Permission denied", HttpStatus.FORBIDDEN);
    }

    const updatedSeries = Object.assign(oldSeries, updateSeriesDto);

    // Save the updated series
    const savedSeries = await this.seriesRepository.save(updatedSeries);

    return savedSeries;

  }

  async remove(authorId: number, id: number): Promise<DeleteResult> {

    const series = await this.seriesRepository.findOneBy({ id });

    if (!series) {
      throw new HttpException(`Series not found with id: ${id}`, HttpStatus.NOT_FOUND);
    }

    if (series.authorId != authorId) {
      throw new HttpException(`Permission denied`, HttpStatus.FORBIDDEN)
    }

    return await this.seriesRepository.delete(
      {
        id,
        authorId  //đúng tác giả thì mới có quyền xóa
      }
    );
  }

  async handleVote(type: "upvote" | "downvote", state: "upvote" | "downvote" | "-", seriesId: number, userId: number) {

    const voteQuery = renderVoteQuery(type, state);

    await this.seriesRepository.createQueryBuilder()
      .update()
      .set({ vote: () => voteQuery })
      .where("id = :id", { id: seriesId })
      .execute();

    const check = await this.voteRepository.findOneBy({
      seriesId, userId
    });

    if (state === type) { // bỏ vote
      if (check) {
        await this.voteRepository.delete({ id: check.id });
      }
    } else {
      if (check) { //đã có bản ghi thì cập nhật
        this.voteRepository.update(
          { id: check.id },
          { voteType: type }
        )
      } else { //Chưa có bản ghi
        this.voteRepository.save({
          userId,
          seriesId,
          voteType: type
        });
      }
    }
  }

  async getVotedSeries(userId: number, seriesId: number) {
    const check = await this.voteRepository.findOneBy({
      seriesId,
      userId
    });

    return check;
  }

  //for report
  async createReport(authorId: number, commentId: number, createReportDto: CreateReportDto) {
    return null;
  }

  async getReport(query: ReportQuery) {
    return null;
  }

  async getDetailReport(reportId: number) {
    return null;
  }

  async updateStatusReport(reportId: number, data: any) {
    return null;
  }

}
