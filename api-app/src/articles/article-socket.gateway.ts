import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SocketAuthGuard } from 'src/auth/socketAuth.guard';
import { ArticlesService } from './articles.service';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
@UseGuards(SocketAuthGuard)
export class ArticleSocketGateway {
  constructor(private readonly articleSocketService: ArticlesService) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('vote_article')
  handleVote(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      const { type, dataId, state } = data;
      this.articleSocketService.handleVote(type, state, dataId, (client as any).userData.id);

      const key = "receive_vote_article_" + dataId;
      this.server.sockets.emit(key, { type, dataId, state });
    } catch (error) {
      console.error(error);
    }
  }
}
