import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RecordingDelete } from "../models/recordingDelete.model";
import { Model } from "mongoose";
import * as fs from 'fs';
import { RecordingDeleteDTO } from "../models/recordingDeleteDTO.interface";
import { LoggerService } from "src/common/services/logger.service";
import { Recording } from "../models/recording.model";
import { WebsocketService } from "src/common/services/websocket.service";

@Injectable()
export class RecordingDeleteService {
    constructor(@InjectModel(RecordingDelete.name) private readonly recordingDeleteModel: Model<RecordingDelete>,
        @InjectModel(Recording.name) private readonly recordingModel: Model<Recording>,
        private websocketservice: WebsocketService
    ) {
        this.deleteRecordingClean();
    }
    deleteRecordingRun: boolean = false;

    public async deleteRecordingClean(): Promise<void> {
        try {
            if (this.deleteRecordingRun === false) {
                this.deleteRecordingRun = true;
                let recordings: RecordingDeleteDTO[] = await this.recordingDeleteModel.find();
                while (recordings.length > 0) {
                    for (const [index, element] of recordings.entries()) {
                        try {
                            await new Promise((resolve, reject) => {
                                fs.unlink(element.recordingUrl, (err) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve(true);
                                });
                            });
                            await this.recordingDeleteModel.deleteOne({ recordingUrl: element.recordingUrl });
                            await this.recordingModel.deleteOne({ url: element.recordingUrl });
                            await this.websocketservice.recordingDelete(element.recordingUrl);
                            recordings.splice(index, 1);
                        }
                        catch (err) {
                            console.log(err.message);
                        }
                    }
                    recordings = await this.recordingDeleteModel.find();
                }
                this.deleteRecordingRun = false;
            }
        }
        catch (err) {
            console.log(err);
        }
    }

}