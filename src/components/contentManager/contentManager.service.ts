import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from 'fs';
import { Recording } from "./models/recording.model";
import { Model } from "mongoose";
import { LoggerService } from "src/common/services/logger.service";
import { Constants } from "src/common/constants.class";

@Injectable()
export class ContentManagerService {
    constructor(@InjectModel(Recording.name) private readonly recordingModel: Model<Recording>) { }

    async deleteFile(file: string): Promise<boolean> {
        try {
            await new Promise((resolve, reject) => {
                fs.unlink(`${Constants.WOWZA_CONTENT_FOLDER}/${file}`, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            })
            const res = await this.recordingModel.deleteOne({ url: `${Constants.WOWZA_CONTENT_FOLDER}/${file}` });
            if (res == null) {
                LoggerService.logError("didn't delete the recording: " + file, 'mongoDB');
                return false;
            }
            LoggerService.logInfo("deleted the recording: " + file + " successfully");
            return true;
        }
        catch (err) {
            LoggerService.logError(err.message, 'file folder');
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}