import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ThrottlerException } from "@nestjs/throttler";
import { Request, Response } from 'express';
import { TokenService } from "../services/token.service";

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    constructor(private tokenService: TokenService) {}
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const token: string = request.headers.authorization.split(' ')[1];

        this.tokenService.tooManyRequests(token);

        response.status(status).json({
            statusCode: status,
          });
    }

}