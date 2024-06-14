import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { BaseQuery } from 'src/untils/BaseQuery.dto';
import { renderQueryPaging } from 'src/helper/generatePaging';

@Injectable()
export class NotificationService {

  constructor(
    @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
  ) { }

  async create(createNotificationDto: CreateNotificationDto) {
    const { toAllUsers, ...data } = createNotificationDto;
    let recipientType: "ALL" | "ADMIN" | "PERSONAL" = "PERSONAL"; //Mặc định là thông báo cá nhân

    if (toAllUsers === 'ALL') { //Thông báo cho tất cả người dùng
      recipientType = "ALL";
    } else if (toAllUsers === "ADMIN") { //Chỉ admin
      recipientType = "ADMIN";
    }

    const notification = await this.notificationRepository.create({
      ...data,
      recipientType
    });

    return await this.notificationRepository.save(notification);
  }

  async findAll(userId: number, query: BaseQuery): Promise<[response: Notification[], unreadTotal: number, total: number]> {

    const { skip, itemPerPage } = renderQueryPaging(query);

    const unreadTotal = await this.notificationRepository.createQueryBuilder('notification').where({ read: false })
      .andWhere('notification.recipientId = :userId or notification.recipientType like :recipientType', { userId: userId, recipientType: "ALL" })
      .getCount();

    const [response, total] = await this.notificationRepository.createQueryBuilder('notification')
      .andWhere('notification.recipientId = :userId or notification.recipientType like :recipientType', { userId: userId, recipientType: "ALL" })
      .take(itemPerPage)
      .skip(skip)
      .orderBy("notification.createdAt", 'DESC')
      .getManyAndCount();

    return [response, unreadTotal, total];
  }

  async findOne(id: number) {
    const result = await this.notificationRepository.findOneBy({ id });

    if (!result) {
      throw new HttpException(`Notification not found with id: ${id}`, HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async findAllAdmin(query: BaseQuery): Promise<[response: Notification[], unreadTotal: number, total: number]> {
    const { skip, itemPerPage } = renderQueryPaging(query);

    const unreadTotal = await this.notificationRepository.createQueryBuilder('notification').where({ read: false })
      .andWhere('notification.recipientType like :recipientType', { recipientType: "ADMIN" })
      .getCount();

    const [response, total] = await this.notificationRepository.createQueryBuilder('notification')
      .andWhere('notification.recipientType like :recipientType', { recipientType: "ADMIN" })
      .take(itemPerPage)
      .skip(skip)
      .orderBy("notification.createdAt", 'DESC')
      .getManyAndCount();

    return [response, unreadTotal, total];
  }

  async updateRead(id: number) {
    const notification = await this.notificationRepository.findOneBy({
      id
    });

    if (!notification) {
      throw new HttpException(`Notification not found with id: ${id}`, HttpStatus.NOT_FOUND)
    }

    const { read, ...data } = notification;

    return this.notificationRepository.save({
      ...data,
      read: true
    })
  }

}
