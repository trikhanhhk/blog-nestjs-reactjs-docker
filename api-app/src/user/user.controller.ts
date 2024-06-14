import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseArrayPipe, Post, Put, Query, Req, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { ExceptionsLoggerFilter } from 'src/untils/exceptionsLogger.filter';
import { BaseResponse } from '../common/base-response.dto';
import { BaseFilter } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AddUserDto } from './dto/add-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageItem } from './image.entity';
import { renderPagingResponse } from 'src/helper/generatePaging';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/UpdatePasswordDto';
import { S3Service } from 'src/s3/s3.service';
import { fileValidator } from 'src/helper/fileValidator';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Public } from 'src/auth/decorator/public.decorator';
import { FilterTime } from 'src/types/BaseType';
import { AdminUpdateUserDto } from './dto/user-admin-update.dto';

@ApiBearerAuth()
@ApiTags("User")
@Controller('api/v1/user')
@UseFilters(ExceptionsLoggerFilter)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service
  ) { }

  @Get()
  @Public()
  async getAllUser(@Req() req: any, @Query() query: BaseFilter) {
    let isAdmin = false;

    if (req && req.user && req.user.role === "ADMIN") {
      isAdmin = true
    }

    const [data, total] = await this.userService.getAllUser(isAdmin, query);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);
    return new BaseResponse<User[]>(data, pagination);
  }

  @Get("/count")
  @Roles("ADMIN", "POST_ADMIN")
  async getCountUser(@Query() query: FilterTime) {
    const result = await this.userService.getCountUser(query);
    return new BaseResponse<number>(result);

  }

  @Get("/:userId/userFollowers")
  @Public()
  async getUserFollowers(@Query() query: BaseFilter, @Param('userId') userId: string): Promise<BaseResponse<User[]>> {
    const [users, total] = await this.userService.getUserFollowers(query, +userId);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);
    return new BaseResponse<User[]>(users, pagination);
  }

  @Get("/:userId/userFollowings")
  @Public()
  async getUserFollowing(@Query() query: BaseFilter, @Param('userId') userId: string): Promise<BaseResponse<User[]>> {
    const [users, total] = await this.userService.getUserFollowings(query, +userId);
    const pagination = renderPagingResponse(query.itemPerPage, query.page, total);
    return new BaseResponse<User[]>(users, pagination);
  }

  @Get("/:followId/follow")
  async checkUserFollow(@Req() req: any, @Param('followId') followId: string): Promise<BaseResponse<boolean>> {
    return new BaseResponse<boolean>(await this.userService.checkUserFollow(+req.userData.id, +followId));
  }

  @Get(":id")
  @Public()
  async getDetailUser(@Req() req: any, @Param('id') userId: string) {
    let isAdmin = false;

    if (req && req.user && req.user.role === "ADMIN") {
      isAdmin = true
    }

    const { password, refresh_token, ...data } = await this.userService.getDetailUser(isAdmin, +userId);
    return new BaseResponse<object>(data);
  }

  @Post()
  @Roles('ADMIN')
  async addNewUser(@Body() userDto: AddUserDto) {
    const { password, refresh_token, ...data } = await this.userService.addNewUser(userDto);
    return new BaseResponse<object>(data);
  }

  @Delete("/:id")
  @Roles('ADMIN')
  async deleteUser(@Param('id') id: string) {
    return new BaseResponse<User>(await this.userService.deleteUser(+id));
  }

  @Delete()
  @Roles('ADMIN')
  async multipleDeleteUser(@Query('delete_ids', new ParseArrayPipe({ items: String, separator: ',' })) ids: string[]) {
    return new BaseResponse<UpdateResult>(await this.userService.multipleDelete(ids));
  }

  @Post("uploadAvatar")
  @UseInterceptors(FileInterceptor('avatar', {
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
  }))
  async uploadAvatar(@Req() req: any, @UploadedFile() avatar: Express.Multer.File): Promise<BaseResponse<ImageItem>> {
    let imageItem = null;
    if (fileValidator(avatar)) {
      const resultS3 = await this.s3Service.uploadFile(avatar);
      imageItem = await this.userService.updateAvatar(parseInt(req.userData.id), resultS3);
    }

    return new BaseResponse<ImageItem>(imageItem);
  }

  @Put("/:id/restoreUser")
  @Roles("ADMIN")
  async restoreUsers(@Param("id") id: string) {
    return new BaseResponse<any>(await this.userService.restoreUser(+id));
  }

  @Put("/:id/updatePassword")
  async updatePassword(@Req() req: any, @Body() updatePasswordDto: UpdatePasswordDto) {
    const { password, refresh_token, ...data } = await this.userService.updateNewPassword(+(req.userData.id), updatePasswordDto);
    return new BaseResponse<any>(data);
  }

  @Put("/:id/updateSocialLink")
  async updateSocialLink(@Param('id') id: string, @Req() req: any, @Body() updateUserDto: UpdateUserDto): Promise<BaseResponse<UpdateResult>> {
    if (+id !== +req.userData.id) {
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
    }
    return new BaseResponse<UpdateResult>(await this.userService.updateSocialLink(req.userData.id, updateUserDto));
  }

  @Put("/:id/updateUserProfile")
  async updateProfileUser(@Param('id') id: string, @Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    if (+id !== +req.userData.id) {
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
    }
    const { password, refresh_token, ...data } = await this.userService.updateUserProfile(+(req.userData.id), updateUserDto)
    return new BaseResponse<any>(data);
  }

  @Put("/:id")
  @Roles("ADMIN")
  async updateUser(@Param('id') id: string, @Body() updateUser: AdminUpdateUserDto) {
    const { password, refresh_token, ...user } = await this.userService.adminUpdateUser(+id, updateUser);
    return new BaseResponse<any>(user);
  }

  @Put("/:id/status")
  @Roles("ADMIN")
  async updateStatus(@Param('id') id: string, @Body() body: { status: 0 | 1 }) {
    const { password, refresh_token, ...user } = await this.userService.updateStatus(+id, body.status);
    return new BaseResponse<any>(user);
  }

  @Post("/:followId/follow")
  async handleFollow(@Param('followId') followId: number, @Req() req: any, @Query() query: any) {
    return new BaseResponse<{ followId: number, type: "follow" | "unfollow" }>(await this.userService.handleFollow(+followId, req.userData.id, query));
  }

}
