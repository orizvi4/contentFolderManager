import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Constants } from "../constants.class";
import { Request } from 'express';
import { TokenService } from "../services/token.service";

@Injectable()
export class EditorGuard implements CanActivate {
    constructor(private tokenService: TokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token: string = this.extractTokenFromHeader(request);
        if (token) {
            if (await this.tokenService.verifyEditor(token)) {
                return true;
            }
        }
        throw new UnauthorizedException();
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}