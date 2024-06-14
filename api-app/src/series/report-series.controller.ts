import { Body, Controller, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CreateReportDto } from "src/create-report.dto";
import { BaseResponse } from "src/common/base-response.dto";
import { Roles } from "src/auth/decorator/role.decorator";
import { renderPagingResponse } from "src/helper/generatePaging";
import { SeriesService } from "./series.service";
import { SeriesReport } from "./entities/series-report.entity";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ExceptionsLoggerFilter } from "src/untils/exceptionsLogger.filter";

@ApiBearerAuth()
@ApiTags("Report Series")
@Controller('api/v1/reportSeries')
@UseFilters(ExceptionsLoggerFilter)
export class ReportCommentController {
  constructor(
    private readonly seriesService: SeriesService,
  ) { }


  @Post()
  async reportArticle(@Req() req: any, @Body() createReportDto: CreateReportDto) {
    const result = await this.seriesService.createReport(req.userData.id, +createReportDto.dataId, createReportDto);
    return new BaseResponse<SeriesReport>(result);
  }

  @Get()
  @Roles("ADMIN")
  async getReportArticle(@Query() query: any) {
    const [result, total] = await this.seriesService.getReport(query);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);

    return new BaseResponse<SeriesReport[]>(result, pagination);
  }

  @Get(":id")
  @Roles("ADMIN")
  async getDetailReport(@Req() req: any, @Param("id") reportId: string) {
    if (req.user.role === 'ADMIN' || req.user.role === 'POST_ADMIN') {
      const result = await this.seriesService.getDetailReport(+reportId);
      return new BaseResponse<SeriesReport>(result);
    } else {
      const { authorId, author, ...result } = await this.seriesService.getDetailReport(+reportId);
      return new BaseResponse<SeriesReport>(result);
    }
  }

  @Put(":id/status")
  @Roles("ADMIN")
  async updateStatus(@Param("id") reportId: string, @Body() data: any) {

    const result = await this.seriesService.updateStatusReport(+reportId, data);

    return new BaseResponse<SeriesReport>(result);
  }
}