import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Constants } from "../constants.class";
import { LoggerService } from "./logger.service";

@Injectable()
export class TokenService {

    public async tooManyRequests(token: string): Promise<void> {
        await axios.post<void>(`${Constants.AUTH_SERVICE}/strike/dos`, {token: token});
    }

    public async verify(token: string): Promise<boolean> {
        try {
            return (await axios.get<boolean>(`${Constants.AUTH_SERVICE}/tokens/verify`, { headers: { Authorization: `Bearer ${token}` } })).data;
        }
        catch (err) {
            console.log(err);
            LoggerService.logError(err, "token");
            if ((err as AxiosError).response.status == 401) {
                throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
        }
    }
    public async verifyManager(token: string): Promise<boolean> {
        try {
            return (await axios.get<boolean>(`${Constants.AUTH_SERVICE}/tokens/verify/manager`, { headers: { Authorization: `Bearer ${token}` } })).data;
        }
        catch (err) {
            console.log(err.response.data);
            LoggerService.logError(err, "token");
            if ((err as AxiosError).response.status == 401) {
                throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
        }
    }
    public async verifyEditor(token: string): Promise<boolean> {
        try {
            return (await axios.get<boolean>(`${Constants.AUTH_SERVICE}/tokens/verify/editor`, { headers: { Authorization: `Bearer ${token}` } })).data;
        }
        catch (err) {
            console.log(err);
            LoggerService.logError(err, "token");
            if ((err as AxiosError).response.status == 401) {
                throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
        }
    }
}