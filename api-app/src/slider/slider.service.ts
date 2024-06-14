import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Slider } from './entities/slider.entity';
import { In, Repository } from 'typeorm';
import { renderQueryPaging } from 'src/helper/generatePaging';
import { SliderQuery } from 'src/untils/SliderQuery';
import { HttpStatusCode } from 'axios';
import { logger } from 'src/logger/winston.config';

@Injectable()
export class SliderService {

  constructor(
    @InjectRepository(Slider) private readonly sliderRepository: Repository<Slider>,
  ) { }

  async create(createSliderDto: CreateSliderDto, imagePath: string) {
    return await this.sliderRepository.save({
      ...createSliderDto,
      imagePath
    })
  }

  async findAll(query: SliderQuery): Promise<[data: Slider[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);
    const searchTerm = query.search || '';

    const status = query.status;
    const queryBuilder = this.sliderRepository.createQueryBuilder("slider");

    if (searchTerm) {
      queryBuilder.andWhere("slider.name ilike :searchTerm or slider.description ilike :searchTerm", { searchTerm: `%${searchTerm}%` })
    }

    if (status) {
      queryBuilder.andWhere("slider.status like :status", { status });
    }

    const [res, total] = await queryBuilder.select(["slider"])
      .orderBy("slider.createdAt", "DESC")
      .take(itemPerPage)
      .skip(skip)
      .getManyAndCount();

    return [res, total];
  }

  async getCarouselSlider(): Promise<Slider[]> {

    return await this.sliderRepository.findBy(
      { status: "on" }
    )
  }

  async findOne(id: number) {
    const result = await this.sliderRepository.findOneBy({
      id
    });

    if (!result) {
      throw new HttpException(`Slider not found with id: ${id}`, HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async update(id: number, updateSliderDto: UpdateSliderDto, newImagePath: string) {
    let { imagePath, ...data } = await this.findOne(id);

    if (newImagePath) {
      imagePath = newImagePath;
    }

    const record = await this.sliderRepository.save({
      ...data,
      ...updateSliderDto,
      imagePath
    })
    return record;
  }

  async updateStatus(id: number) {
    const { status, ...data } = await this.findOne(id);

    const record = await this.sliderRepository.save({
      ...data,
      status: status === "on" ? "off" : "on"
    });

    return record;
  }

  async remove(id: number) {
    const checkData = await this.findOne(id);
    return await this.sliderRepository.delete({ id: checkData.id });
  }

  async removeMultiple(ids: string[]) {
    logger.info(`Delete multiple user with id = [ ${ids} ]`);
    return await this.sliderRepository.delete({ id: In(ids) });
  }
}
