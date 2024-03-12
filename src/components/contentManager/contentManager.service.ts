import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from 'fs';
import { Recording } from "./models/recording.model";
import { Model } from "mongoose";
import { LoggerService } from "src/common/services/logger.service";
import { Constants } from "src/common/constants.class";
import { RecordingDelete } from "./models/recordingDelete.model";
import { RecordingDeleteService } from "./services/recordingDelete.service";
import { RecordingDeleteDTO } from "./models/recordingDeleteDTO.interface";

@Injectable()
export class ContentManagerService {
    constructor(
        @InjectModel(Recording.name) private readonly recordingModel: Model<Recording>,
        @InjectModel(RecordingDelete.name) private readonly recordingDeleteModel: Model<RecordingDelete>,
        private recordingDeleteService: RecordingDeleteService,
    ) { }

    public async deleteFile(file: string): Promise<boolean> {
        try {
            await new Promise((resolve, reject) => {
                fs.unlink(`${Constants.WOWZA_CONTENT_FOLDER}/${file}`, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });
            });
            await this.recordingDeleteModel.deleteOne({recordingUrl: `${Constants.WOWZA_CONTENT_FOLDER}/${file}`});
            const res = await this.recordingModel.deleteOne({ url: `${Constants.WOWZA_CONTENT_FOLDER}/${file}` });
            if (res == null) {
                LoggerService.logError("didn't delete the recording: " + file, 'mongoDB');
                return false;
            }
            LoggerService.logInfo("deleted the recording: " + file + " successfully");
            return true;
        }
        catch (err) {
            console.log(err);
            if (err.errno != null && err.errno == -4082) {
                await (new this.recordingDeleteModel({
                    recordingUrl: `${Constants.WOWZA_CONTENT_FOLDER}/${file}`
                })).save();
                this.recordingDeleteService.deleteRecordingClean();
                LoggerService.logError(err.message, 'file folder');
                throw new BadRequestException();
            }
            else if (err.status != null && err.status == 400) {
                throw new BadRequestException();
            }
            throw new InternalServerErrorException();
        }
    }
}
