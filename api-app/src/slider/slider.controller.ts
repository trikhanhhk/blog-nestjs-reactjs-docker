import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, Req, Query, UseFilters, ParseArrayPipe, ValidationPipe, UsePipes } from '@nestjs/common';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { renderPagingResponse } from 'src/helper/generatePaging';
import { Slider } from './entities/slider.entity';
import { BaseResponse } from 'src/common/base-response.dto';
import { S3Service } from 'src/s3/s3.service';
import { fileValidator } from 'src/helper/fileValidator';
import { Public } from 'src/auth/decorator/public.decorator';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExceptionsLoggerFilter } from 'src/untils/exceptionsLogger.filter';
import { SliderQuery } from 'src/untils/SliderQuery';
import { DeleteResult } from 'typeorm';

@ApiBearerAuth()
@ApiTags("Slider")
@UseFilters(ExceptionsLoggerFilter)
@Controller('/api/v1/slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService,
    private readonly s3Service: S3Service,
  ) { }

  @Post()
  @Roles('ADMIN', 'POST_ADMIN')
  @UseInterceptors(
    FileInterceptor('slideImage'),
  )
  @UsePipes(ValidationPipe)
  @UseFilters(ExceptionsLoggerFilter)
  async create(@Req() req, @UploadedFile() slideImage: Express.Multer.File, @Body() createSliderDto: CreateSliderDto) {

    let imagePath = null
    if (fileValidator(slideImage)) {
      imagePath = await this.s3Service.uploadFile(slideImage);
    }

    return new BaseResponse<Slider>(await this.sliderService.create(createSliderDto, imagePath));
  }

  @Get()
  @Roles('ADMIN', 'POST_ADMIN')
  async findAll(@Query() query: SliderQuery): Promise<BaseResponse<Slider[]>> {
    const [data, total] = await this.sliderService.findAll(query)
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);
    return new BaseResponse<Slider[]>(data, pagination);
  }

  @Get('/carousel')
  @Public()
  async getSlider(): Promise<BaseResponse<Slider[]>> {
    const response = await this.sliderService.getCarouselSlider()
    return new BaseResponse<Slider[]>(response);
  }

  @Get(':id')
  @Roles('ADMIN', 'POST_ADMIN')
  async findOne(@Param('id') id: string) {
    return new BaseResponse<Slider>(await this.sliderService.findOne(+id));
  }

  @Put(':id')
  @Roles('ADMIN', 'POST_ADMIN')
  @UseInterceptors(
    FileInterceptor('slideImage'),
  )
  async update(@Param('id') id: string, @UploadedFile() slideImage: Express.Multer.File, @Body() updateSliderDto: UpdateSliderDto) {

    let imagePath = null;
    if (slideImage && fileValidator(slideImage)) {
      imagePath = await this.s3Service.uploadFile(slideImage);
    }

    const result = await this.sliderService.update(+id, updateSliderDto, imagePath);
    return new BaseResponse<Slider>(result);
  }

  @Put(':id/status')
  @Roles('ADMIN', 'POST_ADMIN')
  async updateStatus(@Param('id') id: string) {
    const result = await this.sliderService.updateStatus(+id);
    return new BaseResponse<Slider>(result);
  }

  @Delete(':id')
  @Roles('ADMIN', 'POST_ADMIN')
  async remove(@Param('id') id: string) {
    const response = await this.sliderService.remove(+id);
    return new BaseResponse<DeleteResult>(response);
  }

  @Delete()
  @Roles('ADMIN', 'POST_ADMIN')
  async removeMultiple(@Query('ids', new ParseArrayPipe({ items: String, separator: ',' })) ids: string[]) {
    const response = await this.sliderService.removeMultiple(ids);
    return new BaseResponse<DeleteResult>(response);
  }
}
