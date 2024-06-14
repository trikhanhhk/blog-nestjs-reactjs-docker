import { Body, Controller, Get, Param, Post, Put, Query, Req, UseFilters } from "@nestjs/common";
import { CommentSocketService } from "./comment-socket.service";
import { CreateReportDto } from "src/create-report.dto";
import { BaseResponse } from "src/common/base-response.dto";
import { CommentReport } from "./entities/comment-report.entity";
import { Roles } from "src/auth/decorator/role.decorator";
import { renderPagingResponse } from "src/helper/generatePaging";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ExceptionsLoggerFilter } from "src/untils/exceptionsLogger.filter";

@ApiBearerAuth()
@ApiTags("Report comment")
@Controller('api/v1/reportComment')
@UseFilters(ExceptionsLoggerFilter)
export class ReportCommentController {
  constructor(
    private readonly commentService: CommentSocketService,
  ) { }


  @Post()
  async create(@Req() req: any, @Body() createReportDto: CreateReportDto) {
    const result = await this.commentService.createReport(req.userData.id, +createReportDto.dataId, createReportDto);
    return new BaseResponse<CommentReport>(result);
  }

  @Get()
  @Roles("ADMIN")
  async getReportArticle(@Query() query: any) {
    const [result, total] = await this.commentService.getReport(query);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);

    return new BaseResponse<CommentReport[]>(result, pagination);
  }

  @Get(":id")
  async getDetailReport(@Req() req: any, @Param("id") reportId: string) {
    if (req.user.role === 'ADMIN' || req.user.role === 'POST_ADMIN') {
      const result = await this.commentService.getDetailReport(+reportId);
      return new BaseResponse<CommentReport>(result);
    } else {
      const { authorId, author, ...result } = await this.commentService.getDetailReport(+reportId);
      return new BaseResponse<any>(result);
    }
  }

  @Put(":id/status")
  @Roles("ADMIN")
  async updateStatus(@Param("id") reportId: string, @Body() data: any) {
    const result = await this.commentService.updateStatusReport(+reportId, data);

    return new BaseResponse<CommentReport>(result);
  }
}