import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, In, Long, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { BaseFilter } from './dto/filter-user.dto';
import { logger } from 'src/logger/winston.config';
import { AddUserDto } from './dto/add-user.dto';
import { ImageItem } from './image.entity';
import { FilterImage } from './dto/filter-image.dto';
import { renderQueryPaging } from 'src/helper/generatePaging';
import { UserFollower } from './userFollower.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/UpdatePasswordDto';
import { renderFilterTimeQuery } from 'src/helper/renderFilderTime';
import { FilterTime } from 'src/types/BaseType';
import { AdminUpdateUserDto } from './dto/user-admin-update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserFollower) private userFollowRepository: Repository<UserFollower>,
    @InjectRepository(ImageItem) private imageItemRepository: Repository<ImageItem>,
  ) { }

  async getAllUser(isAdmin: boolean, query: BaseFilter): Promise<[users: User[], total: number]> {
    const { itemPerPage, skip } = renderQueryPaging(query);
    const searchTerm = query.search || '';
    //search full text for search;

    const queryBuilder = await this.userRepository.createQueryBuilder('user')
      .where("(user.first_name Ilike :searchTerm or user.last_name Ilike :searchTerm or user.email Ilike :searchTerm)", { searchTerm: `%${searchTerm}%` })

    if (!isAdmin) {
      queryBuilder.andWhere("user.isDelete = :isDelete", { isDelete: 0 });
    } else {
      if (query.isDelete) {
        queryBuilder.andWhere('user.isDelete = :isDelete', { isDelete: query.isDelete });
      }
      if (query.status) {
        queryBuilder.andWhere('user.status = :status', { status: query.status });
      }
    }

    queryBuilder.orderBy("user.createdAt", "DESC").take(itemPerPage).skip(skip)
      .select(['user.id', 'user.avatarPath', 'user.first_name', 'user.last_name', 'user.email', 'user.status', 'user.isDelete', 'user.createdAt', 'user.updatedAt']);

    const [res, total] = await queryBuilder.getManyAndCount();

    return [res, total];
  }

  async getCountUser(
    query: FilterTime
  ) {
    const { time, from, to } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    renderFilterTimeQuery(queryBuilder, time, from, to);

    const total = await queryBuilder.getCount();
    return total
  }

  async getDetailUser(isAdmin: boolean, id: number) {
    const queryBuilder = this.userRepository.createQueryBuilder("user")
      .where("user.id = :id", { id })

    if (!isAdmin) {
      queryBuilder.andWhere("user.isDelete = :isDelete", { isDelete: 0 });
    }

    const data: User = await queryBuilder.getOne();
    if (!data) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    return data;
  }

  async addNewUser(userDto: AddUserDto) {
    const hashPassword = await this.hashPassword(userDto.password);
    return await this.userRepository.save({
      ...userDto,
      password: hashPassword,
    });
  }

  async updateSocialLink(userId: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(
      { id: userId },
      {
        githubLink: updateUserDto.githubLink,
        facebookLink: updateUserDto.facebookLink,
        discordLink: updateUserDto.discordLink,
      }
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async deleteUser(id: number) {
    logger.info(`Delete user with id = ${id}`);
    const data: User | undefined = await this.userRepository.findOneBy({ id });

    if (!data) {
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.save({
      ...data,
      isDelete: 1
    });
  }

  async multipleDelete(ids: string[]) {
    logger.info(`Delete multiple user with id = [ ${ids} ]`);
    return await this.userRepository.update(
      { id: In(ids) },
      { isDelete: 1 }
    )
  }

  async restoreUser(id: number) {
    const oldUser = await this.userRepository.findOneBy({
      id
    });

    if (!oldUser) {
      throw new HttpException(`User not found with id: ${id}`, HttpStatus.NOT_FOUND);
    }

    return this.userRepository.save({
      ...oldUser,
      isDelete: 0
    })
  }

  async adminUpdateUser(id: number, adminUpdateUserDto: AdminUpdateUserDto) {
    const oldUser = await this.userRepository.findOneBy({
      id
    });

    if (!oldUser) {
      throw new HttpException(`User not found with id: ${id}`, HttpStatus.NOT_FOUND);
    }

    return this.userRepository.save({
      ...oldUser,
      ...adminUpdateUserDto
    })
  }

  async updateNewPassword(userId: number, updatePassword: UpdatePasswordDto) {
    const checkUserExisted = await this.userRepository.findOneBy({ id: userId });
    if (!checkUserExisted) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    if (checkUserExisted.flagFirst) {

      return await this.updatePassword(updatePassword.newPassword, checkUserExisted);

    } else {
      const isMatch = bcrypt.compareSync(updatePassword.oldPassword, checkUserExisted.password);

      if (!isMatch) {
        throw new HttpException('Old password incorrect', HttpStatus.UNAUTHORIZED);
      }

      return await this.updatePassword(updatePassword.newPassword, checkUserExisted);
    }
  }

  private async updatePassword(newPassword: string, oldUser: User) {
    const hashPassword = await this.hashPassword(newPassword);
    return this.userRepository.save(
      {
        ...oldUser,
        flagFirst: false,
        password: hashPassword
      }
    )
  }

  async updateAvatar(id: number, avatar: string): Promise<ImageItem> {
    this.imageItemRepository
      .createQueryBuilder()
      .update(ImageItem)
      .set({ isAvatar: 0 })
      .where("userId= $1", [id])
      .andWhere("isAvatar= 1")
      .execute();
    const newImageItem = this.imageItemRepository.create({
      path: avatar,
      isAvatar: 1,
      author: { id: id },
    });

    const imageSaved = await this.imageItemRepository.save(newImageItem);

    this.userRepository.update(
      { id: id },
      { avatarPath: imageSaved.path }
    )

    return imageSaved;
  }

  async updateUserProfile(id: number, userData: UpdateUserDto) {

    const oldUser = await this.userRepository.findOneBy({ id });

    if (!oldUser) {
      throw new HttpException(`User Not Found With id: ${id}`, HttpStatus.NOT_FOUND);
    }

    const result = this.userRepository.save({
      ...oldUser,
      ...userData
    });

    return result;
  }

  async getImageById(id: number): Promise<ImageItem | undefined> {
    return this.imageItemRepository.findOneBy({ id });
  }

  async getListImage(query: FilterImage): Promise<[imageItem: ImageItem[], total: number]> {
    const itemPerPage = query.itemPerPage || 20;
    const page = query.page || 1;
    const skip = (page - 1) * itemPerPage;
    const userId = query.userId;

    const [res, total] = await this.imageItemRepository.findAndCount({
      where: { author: { id: userId } },
      order: { createdAt: "DESC" },
      take: itemPerPage,
      skip: skip
    });

    return [res, total];
  }

  async handleFollow(followId: number, userId: number, query: any): Promise<{ followId: number, type: "follow" | "unfollow" }> {
    const { type } = query;

    if (type === "follow") {
      const result = this.userFollowRepository.save(
        {
          followerId: userId,
          followingId: followId
        }
      )
    } else {
      const result = this.userFollowRepository.delete(
        {
          followerId: userId,
          followingId: followId
        }
      )
    }
    return { followId: followId, type: type };
  }

  async checkUserFollow(userId: number, followId: number): Promise<boolean> {
    const check = await this.userFollowRepository.findOneBy(
      {
        followerId: userId,
        followingId: followId
      }
    )
    return check ? true : false
  }

  async getUserFollowers(query: BaseFilter, userId: number): Promise<[users: User[], total: number]> { //danh sách người theo dõi user
    const { itemPerPage, skip } = renderQueryPaging(query);
    const searchTerm = query.search || '';
    console.log("search", searchTerm);
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.following', 'following')
      .select(['user.id', 'user.first_name', 'user.last_name', 'user.email', 'user.avatarPath', 'user.facebookLink', 'user.githubLink', 'user.discordLink'])
      .where('following.following_id = :userId', { userId })
      .take(itemPerPage)
      .skip(skip)
      .getManyAndCount();
    return [users, total];
  }

  async getUserFollowings(query: BaseFilter, userId: number): Promise<[users: User[], total: number]> { //danh sách người user đang theo dõi
    const { itemPerPage, skip } = renderQueryPaging(query);
    const searchTerm = query.search || '';
    console.log("search", searchTerm);
    const [users, total] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.followers', 'follower')
      .select(['user.id', 'user.first_name', 'user.last_name', 'user.email', 'user.avatarPath', 'user.facebookLink', 'user.githubLink', 'user.discordLink'])
      .where('follower.followerId = :userId', { userId })
      .take(itemPerPage)
      .skip(skip)
      .getManyAndCount();
    return [users, total];
  }


  async updateStatus(id: number, status: 0 | 1) {
    const checkUser = await this.userRepository.findOneBy({ id });

    if (!checkUser) {
      throw new HttpException(`User Not Found With id: ${id}`, HttpStatus.NOT_FOUND);
    }

    return await this.userRepository.save({
      ...checkUser,
      status
    })
  }

}