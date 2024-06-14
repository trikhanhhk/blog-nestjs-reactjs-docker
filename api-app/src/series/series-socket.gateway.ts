import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketAuthGuard } from "src/auth/socketAuth.guard";
import { SeriesService } from "./series.service";

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
@UseGuards(SocketAuthGuard)
export class SeriesSocketGateway {
  constructor(private readonly seriesService: SeriesService) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('vote_series')
  handleVote(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    try {
      console.log("Server receive: ", data);
      const { type, dataId, state } = data;
      this.seriesService.handleVote(type, state, dataId, (client as any).userData.id);

      const key = "receive_vote_series_" + dataId;
      this.server.sockets.emit(key, { type, dataId, state });
    } catch (error) {
      console.error(error);
    }
  }
}
