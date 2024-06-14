import { Body, Controller, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ExceptionsLoggerFilter } from "src/untils/exceptionsLogger.filter";
import { ArticlesService } from "./articles.service";
import { BaseResponse } from "src/common/base-response.dto";
import { ArticleReport } from "./entities/article-report.entity";
import { CreateReportDto } from "src/create-report.dto";
import { renderPagingResponse } from "src/helper/generatePaging";
import { Roles } from "src/auth/decorator/role.decorator";

@Controller('api/v1/articlesReport')
@UseFilters(ExceptionsLoggerFilter)
@ApiBearerAuth()
@ApiTags('Article Report')
export class ArticlesReportController {
  constructor(
    private readonly articlesService: ArticlesService
  ) { }

  @Post()
  async reportArticle(@Req() req: any, @Body() createReportDto: CreateReportDto) {
    const result = await this.articlesService.createReport(req.userData.id, +createReportDto.dataId, createReportDto);
    return new BaseResponse<ArticleReport>(result);
  }

  @Get()
  @Roles("ADMIN")
  async getReportArticle(@Query() query: any) {
    const [result, total] = await this.articlesService.getReport(query);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);

    return new BaseResponse<ArticleReport[]>(result, pagination);
  }

  @Get(":id")
  async getDetailReport(@Req() req: any, @Param("id") reportId: string) {
    if (req.user.role === 'ADMIN' || req.user.role === 'POST_ADMIN') {
      const result = await this.articlesService.getDetailReport(+reportId);
      return new BaseResponse<ArticleReport>(result);
    } else {
      const { authorId, author, ...result } = await this.articlesService.getDetailReport(+reportId);
      return new BaseResponse<any>(result);
    }
  }

  @Put(":id/status")
  @Roles("ADMIN")
  async updateStatus(@Param("id") reportId: string, @Body() data: any) {
    console.log("data", data);
    const result = await this.articlesService.updateStatusReport(+reportId, data.status);

    return new BaseResponse<ArticleReport>(result);
  }

}