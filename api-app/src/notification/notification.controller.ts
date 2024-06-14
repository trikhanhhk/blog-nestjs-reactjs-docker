import { Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { BaseQuery } from 'src/untils/BaseQuery.dto';
import { renderPagingResponse } from 'src/helper/generatePaging';
import { BaseResponse } from 'src/common/base-response.dto';
import { Notification } from './entities/notification.entity';
import { Roles } from 'src/auth/decorator/role.decorator';

@Controller('/api/v1/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  async findAll(@Query() query: BaseQuery, @Req() req: any) {

    const [notifications, unreadTotal, total] = await this.notificationService.findAll(+req.userData.id, query);

    const paging = renderPagingResponse(query.itemPerPage, query.page, total);
    return new BaseResponse<{ notifications: Notification[], unreadTotal: number }>({ notifications, unreadTotal }, paging);
  }

  @Get('/admin')
  @Roles("ADMIN")
  async findAllAdmin(@Query() query: BaseQuery) {
    const [notifications, unreadTotal, total] = await this.notificationService.findAllAdmin(query);

    const paging = renderPagingResponse(query.itemPerPage, query.page, total);

    return new BaseResponse<{ notifications: Notification[], unreadTotal: number }>({ notifications, unreadTotal }, paging);
  }

  @Get('/:id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const result = await this.notificationService.findOne(+id);

    return new BaseResponse<Notification>(result);
  }

  @Put(":id")
  async updateRead(@Param('id') id: number) {
    return new BaseResponse<Notification>(await this.notificationService.updateRead(id));
  }

}
