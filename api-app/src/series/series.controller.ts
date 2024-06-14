import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseFilters, Req, Query, Put, ValidationPipe, UsePipes } from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExceptionsLoggerFilter } from 'src/untils/exceptionsLogger.filter';
import { BaseResponse } from 'src/common/base-response.dto';
import { Series } from './entities/series.entity';
import { BaseFilter } from 'src/untils/base-filter.dto';
import { renderPagingResponse } from 'src/helper/generatePaging';
import { DeleteResult } from 'typeorm';
import { SeriesVote } from './entities/series-vote.entity';
import { Public } from 'src/auth/decorator/public.decorator';
import { FilterTime } from 'src/types/BaseType';

@ApiBearerAuth()
@ApiTags("Series")
@Controller('api/v1/series')
@UseFilters(ExceptionsLoggerFilter)
@UsePipes(ValidationPipe)
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) { }

  @Post()
  @UsePipes(ValidationPipe)
  @UseFilters(ExceptionsLoggerFilter)
  async create(@Req() req, @Body() createSeriesDto: CreateSeriesDto) {
    const result = await this.seriesService.create(+req.userData.id, createSeriesDto);
    return new BaseResponse<Series>(result);
  }

  @Get()
  @Public()
  async findAll(@Req() req: any, @Query() query: BaseFilter) {
    let isAdmin = false;

    if ((req && req.user) && (req.user.role === "ADMIN" || req.user.role === "POST_ADMIN")) {
      isAdmin = true;
    }

    const [res, total] = await this.seriesService.findAll(isAdmin, query);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);

    return new BaseResponse<Series[]>(res, pagination);
  }

  @Get('/count')
  @Public()
  async getCountSeries(@Query() query: FilterTime) {
    const result = await this.seriesService.countSeries(query);
    return new BaseResponse<number>(result);
  }

  @Get("/:id/vote")
  async checkVotedSeries(@Req() req: any, @Param('id') seriesId: string) {
    const data = await this.seriesService.getVotedSeries(+req.userData.id, +seriesId);
    return new BaseResponse<SeriesVote>(data)
  }

  @Get('/:id')
  @Public()
  async findOne(@Param('id') id: string) {
    await this.seriesService.counterView(+id);
    const record = await this.seriesService.findOne(+id);
    return new BaseResponse<Series>(record);
  }

  @Put('/:id')
  @UseFilters(ExceptionsLoggerFilter)
  @UsePipes(ValidationPipe)
  async update(@Req() req, @Param('id') id: string, @Body() updateSeriesDto: UpdateSeriesDto) {
    console.log("updateSeriesDto", updateSeriesDto);
    const record = await this.seriesService.update(+req.userData.id, +id, updateSeriesDto)
    return new BaseResponse<Series>(record);
  }

  @Delete('/:id')
  async remove(@Req() req, @Param('id') id: string) {
    const result = await this.seriesService.remove(+req.userData.id, +id)
    return new BaseResponse<DeleteResult>(result);
  }
}
