import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentSocketDto } from './create-comment-socket.dto';

export class UpdateCommentSocketDto extends PartialType(CreateCommentSocketDto) {
  id: number;
}
