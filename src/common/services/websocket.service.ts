import { Injectable } from "@nestjs/common";
import axios from "axios";
import { Constants } from "../constants.class";
import { LoggerService } from "./logger.service";


@Injectable()
export class WebsocketService {
    public async recordingDelete(recordingUrl: string) {
        try {
            await axios.post<void>(`${Constants.WEBSOCKET_PATH}/recording/delete`, {recordingUrl: recordingUrl});
        }
        catch (err) {
            console.log(err);
            LoggerService.logError(err, "websocket");
        }
    }
}