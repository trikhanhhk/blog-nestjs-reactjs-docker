import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { WebSocketServer } from '@nestjs/websockets';
// import { Server } from 'socket.io';
import { Observable } from 'rxjs';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  // @WebSocketServer() server: Server;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient(); // Lấy client của WebSocket
    const token = this.extractTokenFromBody(client);

    if (!token) {
      client.emit('error', 'No token provided');
      client.disconnect();
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.userData = payload;
    } catch (error) {
      client.emit('error', 'Invalid token');
      client.disconnect();
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromBody(client: any): string | undefined {

    const token = client.handshake.query.token;
    return token;
  }
}
