import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { BaseFilter } from 'src/untils/base-filter.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { BaseResponse } from 'src/common/base-response.dto'
import { Tag } from './entities/tag.entity'
import { DeleteResult } from 'typeorm'
import { renderPagingResponse } from 'src/helper/generatePaging'
import { Roles } from 'src/auth/decorator/role.decorator'
import { TagQuery } from 'src/untils/TagQuery'
import { Public } from 'src/auth/decorator/public.decorator'
import { query } from 'express'

@Controller('api/v1/tags')
@ApiBearerAuth()
@ApiTags('Tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Post()
  @Roles("ADMIN", "POST_ADMIN")
  async createTag(
    @Body() createTagDto: CreateTagDto,
  ) {
    return new BaseResponse<Tag>(await this.tagService.createTag(createTagDto))
  }

  @Get()
  @Public()
  async findAllTag(@Query() query: TagQuery) {
    const [data, total] = await this.tagService.findAllTag(query)
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);
    return new BaseResponse<any[]>(data, pagination)
  }

  @Get(':id')
  @Public()
  async findOneTag(@Param('id') id: string) {
    return new BaseResponse<Tag>(await this.tagService.findOneTag(+id))
  }

  @Put(':id')
  @Roles("ADMIN", "POST_ADMIN")
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return new BaseResponse<Tag>(await this.tagService.update(+id, updateTagDto))
  }

  @Delete(':id')
  @Roles("ADMIN", "POST_ADMIN")
  async remove(@Param('id') id: string) {
    return new BaseResponse<DeleteResult>(await this.tagService.remove(+id))
  }

  @Delete()
  @Roles("ADMIN", "POST_ADMIN")
  async multipleRemove(@Query() query: { ids: string }) {
    return new BaseResponse<DeleteResult>(await this.tagService.multipleRemove(query.ids.split(',')))
  }
}
