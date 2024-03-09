import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from 'fs';
import { Recording } from "./models/recording.model";
import { Model } from "mongoose";
import { LoggerService } from "src/common/services/logger.service";
import { Constants } from "src/common/constants.class";

@Injectable()
export class ContentManagerService {
    constructor(@InjectModel(Recording.name) private readonly recordingModel: Model<Recording>) { }

    public async deleteFile(file: string): Promise<boolean> {
        try {
            if (!(await this.isFolderInUse(file))) {
                await new Promise((resolve, reject) => {
                    fs.unlink(`${Constants.WOWZA_CONTENT_FOLDER}/${file}`, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(true);
                    });
                });
                const res = await this.recordingModel.deleteOne({ url: `${Constants.WOWZA_CONTENT_FOLDER}/${file}` });
                if (res == null) {
                    LoggerService.logError("didn't delete the recording: " + file, 'mongoDB');
                    return false;
                }
                LoggerService.logInfo("deleted the recording: " + file + " successfully");
                return true;
            }
            else {
                throw new BadRequestException();
            }
        }
        catch (err) {
            console.log(err);
            if (err.errno != null && err.errno == -4082) {
                LoggerService.logError(err.message, 'file folder');
                throw new BadRequestException();
            }
            else if (err.status != null && err.status == 400) {
                throw new BadRequestException();
            }
            throw new InternalServerErrorException();
        }
    }

    public async isFolderInUse(file: string): Promise<boolean> {
        try {
            await fs.promises.access(`${Constants.WOWZA_CONTENT_FOLDER}/${file}`, fs.constants.F_OK);
            return false;
        }
        catch (err) {
            console.log(err);
            return true;
        }
    }
}
