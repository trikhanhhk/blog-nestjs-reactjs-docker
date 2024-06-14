import { ArgumentsHost, Catch, UnauthorizedException} from "@nestjs/common"
import { BaseExceptionFilter } from "@nestjs/core";
import { logger } from "src/logger/winston.config";

@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);
    logger.error((exception as Error).stack, { context: exception });
    super.catch(exception, host);
  }
}