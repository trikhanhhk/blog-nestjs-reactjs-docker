import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseFilters,
  Query,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExceptionsLoggerFilter } from 'src/untils/exceptionsLogger.filter';
import { BaseResponse } from 'src/common/base-response.dto';
import { Article } from './entities/article.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseFilter } from 'src/untils/base-filter.dto';
import { renderPagingResponse } from 'src/helper/generatePaging';
import { ArticleVote } from './entities/article-vote.entity';
import { fileValidator } from 'src/helper/fileValidator';
import { S3Service } from 'src/s3/s3.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { FilterTime } from 'src/types/BaseType';

@Controller('api/v1/articles')
@UseFilters(ExceptionsLoggerFilter)
@ApiBearerAuth()
@ApiTags('Article')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly s3Service: S3Service
  ) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('thumbnail')
  )
  async createArticle(
    @Req() req: any,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    let thumbnailPath = null;

    if (thumbnail && fileValidator(thumbnail)) {
      thumbnailPath = await this.s3Service.uploadFile(thumbnail);
    }

    const data = await this.articlesService.createArticle(
      +req.userData.id,
      createArticleDto,
      thumbnailPath,
    )
    if (!data) {
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
    }

    return new BaseResponse<Article>(
      data
    );

  }

  @Post('/cke-upload')
  @UseInterceptors(
    FileInterceptor('image'),
  )
  async ckeUpload(
    @Req() req: any,
    @UploadedFile() image: Express.Multer.File
  ) {
    let url = null;
    if (fileValidator(image)) {
      url = await this.s3Service.uploadFile(image);
      await this.articlesService.ckUpload(parseInt(req.userData.id), url);
    }
    return {
      url
    }
  }

  @Get()
  @Public()
  async findAll(@Req() req: any, @Query() query: BaseFilter) {
    const [res, total] = await this.articlesService.findAllArticle(query, req);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);
    return new BaseResponse<Article[]>(res, pagination);
  }

  @Get('/count')
  @Public()
  async getCountArticle(@Query() query: FilterTime) {
    const result = await this.articlesService.getCountArticle(query);
    return new BaseResponse<number>(result);
  }

  @Get("/:id/following")
  async getArticleFlow(@Req() req: any, @Query() query: BaseFilter) {
    const [res, total] = await this.articlesService.getArticleFlowing(req.userData.id, query);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);

    return new BaseResponse<Article[]>(res, pagination);
  }

  @Get('/:id')
  @Public()
  async findOneArticle(@Param('id') articleId: string) {
    //tăng lượt xem
    await this.articlesService.counterView(articleId);

    //Lấy ra bài viết
    const result = await this.articlesService.findOneArticle(+articleId);

    return new BaseResponse<Article>(result);
  }

  @Get('/:id/getEdit')
  async getArticleEdit(@Req() req: any, @Param("id") articleId: string) {
    return new BaseResponse<Article>(await this.articlesService.findOneArticle(+articleId, +req.userData.id));
  }

  @Get("/:id/vote")
  async checkVotedSeries(@Req() req: any, @Param('id') articleId: string) {
    const data = await this.articlesService.getVotedArticle(req.userData.id, +articleId);
    return new BaseResponse<ArticleVote>(data)
  }

  @Put('/:id')
  @UseInterceptors(
    FileInterceptor('thumbnail')
  )
  async update(@Req() req: any, @Param("id") articleId: string, @UploadedFile() thumbnail: Express.Multer.File, @Body() updateArticleDto: UpdateArticleDto) {

    return new BaseResponse<Article>(await this.articlesService.update(req.userData.id, +articleId, updateArticleDto, thumbnail));
  }

  @Put('/:id/updateSeries')
  async updateSeries(@Req() req: any, @Param("id") articleId: string, @Query() query: { seriesId: number, numberOder: number, type: string }) {
    const result = await this.articlesService.updateSeries(req.userData.id, +articleId, query);
    return new BaseResponse<Article>(result);
  }

  @Put('/:id/status')
  async updateStatus(@Req() req: any, @Param("id") id: string, @Body() body: { status: 1 | 2 }) {
    const result = await this.articlesService.updateStatus(+id, body.status);
    return new BaseResponse<Article>(result);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
