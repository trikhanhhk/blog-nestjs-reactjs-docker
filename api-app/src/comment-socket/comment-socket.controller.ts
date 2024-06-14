import { Body, Controller, Get, Param, Post, Query, Req, UseFilters } from '@nestjs/common';
import { CommentSocketService } from './comment-socket.service';
import { CommentSocketGateway } from './comment-socket.gateway';
import { CreateCommentSocketDto } from './dto/create-comment-socket.dto';
import { BaseResponse } from 'src/common/base-response.dto';
import { Comment } from './entities/comment-socket.entity';
import { BaseFilter } from 'src/untils/base-filter.dto';
import { renderPagingResponse } from 'src/helper/generatePaging';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { CommentVote } from './entities/comment-vote.entity';
import { Public } from 'src/auth/decorator/public.decorator';
import { ExceptionsLoggerFilter } from 'src/untils/exceptionsLogger.filter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags("Comment")
@UseFilters(ExceptionsLoggerFilter)
@Controller('api/v1/comment-socket')
export class CommentSocketController {
  constructor(
    private readonly commentService: CommentSocketService,
    private readonly commentGateway: CommentSocketGateway
  ) { }
  @Post()
  async createComment(@Req() req: any, @Body() commentData: CreateCommentSocketDto): Promise<BaseResponse<Comment>> {
    try {

      const savedComment = await this.commentService.createComment(commentData, parseInt(req.userData.id));

      return new BaseResponse<Comment>(savedComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  @Get("/:id")
  @Public()
  async getDetailComment(@Param('id') id: string) {
    const response = await this.commentService.findOne(+id);
    return new BaseResponse<Comment>(response);
  }

  @Get("/:id/vote")
  async checkVotedComment(@Req() req: any, @Param('id') commentId: string): Promise<BaseResponse<CommentVote>> {
    const data = await this.commentService.getVotedComment(req.userData.id, +commentId);
    return new BaseResponse<CommentVote>(data)
  }

  @Get()
  @Public()
  async getComment(@Query() query: BaseFilter): Promise<BaseResponse<ResponseCommentDto[]>> {
    try {
      const [data, total] = await this.commentService.findAllComment(query)
      const pagination = renderPagingResponse(query.itemPerPage, query.page, total);
      return new BaseResponse<ResponseCommentDto[]>(data, pagination)
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  @Get("/child-comment")
  async getCommentChild(@Query() query: BaseFilter): Promise<BaseResponse<Comment[]>> {
    try {
      const [data, total] = await this.commentService.findChildComment(query.parentId, query.itemPerPage, query.page)
      const pagination = renderPagingResponse(query.itemPerPage, query.page, total);
      return new BaseResponse<Comment[]>(data, pagination)
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }
}
