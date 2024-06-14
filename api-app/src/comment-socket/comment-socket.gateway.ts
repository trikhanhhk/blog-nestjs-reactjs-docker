import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { CommentSocketService } from './comment-socket.service';
import { UpdateCommentSocketDto } from './dto/update-comment-socket.dto';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from 'src/auth/socketAuth.guard';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class CommentSocketGateway {
  constructor(private readonly commentSocketService: CommentSocketService) { }

  @WebSocketServer() server: Server;

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('send_comment')
  async newComment(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {

      const { comment, token } = data;
      const keyArticle = "receive_comment_" + comment.articleId;
      console.log("keyArticle", keyArticle);

      // Gửi lại comment cho tất cả các client đã kết nối
      this.server.sockets.emit(keyArticle, comment);
      console.log("Server response");

    } catch (error) {
      console.error('Error creating comment:', error);
      console.log("Server error");
    }
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage('vote_comment')
  handleVote(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const { type, dataId, state } = data;
      this.commentSocketService.handleVote(type, state, dataId, (client as any).userData.id);

      const key = "receive_vote_comment_" + dataId;
      this.server.sockets.emit(key, { type, dataId, state });
    } catch (error) {
      console.log("Server error");
      console.error(error);
    }
  }
}
