import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private reflector: Reflector
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<string[]>('isPublic', [
      context.getHandler(),
      context.getClass()
    ]);

    const token = this.extractTokenFromHeader(request);
    if (!token && !isPublic) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('SECRET')
      });

      const user = await this.userRepository.findOneBy({ id: payload.id });

      request['userData'] = payload;
      request['user'] = user;

    } catch {
      if (!isPublic) {
        throw new HttpException({
          status: 419,
          message: "Token expired",
        }, 419);
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}