import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Tag } from './entities/tag.entity'
import { DeleteResult, ILike, In, Repository } from 'typeorm';
import { renderQueryPaging } from 'src/helper/generatePaging'
import { TagQuery } from 'src/untils/TagQuery'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) { }

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    return await this.tagRepository.save(createTagDto)
  }

  async findAllTag(query: TagQuery): Promise<[tags: Tag[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);
    const searchTerm = query.search || '';
    //search full text for search;
    const [res, total] = await this.tagRepository.findAndCount({
      where: [{ tagName: ILike(`%${searchTerm}%`) }],
      order: { numberUse: 'DESC', createdAt: 'DESC' },
      take: itemPerPage,
      skip: skip,
    })

    return [res, total]
  }

  async findOneTag(id: number): Promise<Tag> {
    const tag: Tag = await this.tagRepository.findOneBy({ id })
    if (!tag) {
      throw new HttpException('Tag not found', HttpStatus.NOT_FOUND)
    }
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const checkTagExisted = await this.tagRepository.findOneBy({ id });

    if (!checkTagExisted) {
      throw new HttpException(`Tag not found with id: ${id}`, HttpStatus.NOT_FOUND);
    }
    return await this.tagRepository.save({
      ...checkTagExisted,
      ...updateTagDto
    })
  }

  async multipleRemove(ids: string[]) {
    return await this.tagRepository.delete({ id: In(ids) });
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.tagRepository.delete(id)
  }
}
