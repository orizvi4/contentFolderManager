import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from 'fs';
import { Recording } from "./models/recording.model";
import { Model } from "mongoose";
import { LoggerService } from "src/common/services/logger.service";

const CONTENT_PATH = 'C:/Program Files/Wowza Media Systems/Wowza Streaming Engine 4.8.24+4/content';
@Injectable()
export class ContentManagerService {
    constructor(@InjectModel(Recording.name) private readonly recordingModel: Model<Recording>, private loggerService: LoggerService) { }

    async deleteFile(file: string): Promise<boolean> {
        try {
            await new Promise((resolve, reject) => {
                fs.unlink(`${CONTENT_PATH}/${file}`, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            })
            const res = await this.recordingModel.deleteOne({ url: `${CONTENT_PATH}/${file}` });
            if (res == null) {
                this.loggerService.logError("didn't delete the recording: " + file, 'mongoDB');
                return false;
            }
            this.loggerService.logInfo("deleted the recording: " + file + " successfully");
            return true;
        }
        catch (err) {
            this.loggerService.logError(err.message, 'file folder');
            return false;
        }
    }
}