import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { Constants } from 'src/common/constants.class';
import { Recording } from './models/recording.model';
import { RecordingDTO } from './models/recordingDTO.interface';
import { LoggerService } from 'src/common/services/logger.service';


@Injectable()
export class ImportFileService {
    constructor(@InjectModel(Recording.name) private recordingModel: Model<Recording>) { }

    async addToDB(name: string, channel: string, start: Date, end: Date): Promise<boolean> {
        try {
            const recordingEntity: RecordingDTO = {
                channel: channel,
                startAt: new Date(start + 'Z'),
                endAt: new Date(end + 'Z'),
                url: `C:/Program Files/Wowza Media Systems/Wowza Streaming Engine 4.8.24+4/content/${name}`
            }
            const newRecording = new this.recordingModel(recordingEntity);
            await newRecording.save();
            LoggerService.logInfo('recording in channel: ' + channel + ' created successfully');
            return true;
        }
        catch (err) {
            LoggerService.logError(err.message, 'mongoDB');
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    videoSuffix(channel: string) {
        const folderPath = Constants.WOWZA_CONTENT_FOLDER;
        try {

            const files: string[] = fs.readdirSync(folderPath);
    
            let largestNumber = -1;
    
            for (const file of files) {
                const startInd: number = file.indexOf('_');
                const endInd: number = file.indexOf('.mp4');
    
                const suffix: string = file.substring(startInd + 1, endInd);
                if (suffix) {
                    const currentNumber: number = parseInt(suffix, 10);
                    if (currentNumber > largestNumber) {
                        largestNumber = currentNumber;
                    }
                }
            }
            return largestNumber;
        }
        catch(err) {
            LoggerService.logError(err.message, 'file folder');
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async isDateValid(channel: string, start: Date, end: Date): Promise<boolean> {
        try {
            start = new Date(start + 'Z');
            end = new Date(end + 'Z')
            const record: RecordingDTO = await this.recordingModel.findOne({
                $or: [{
                    $and: [
                        {
                            startAt: { $lte: start },
                            endAt: { $gte: start },
                            channel: channel
                        }
    
                    ]
                },
                {
                    $and: [{
                        startAt: { $lte: end },
                        endAt: { $gte: end },
                        channel: channel
                    }]
                },
                {
                    $and: [{
                        startAt: { $gte: start },
                        endAt: { $lte: end },
                        channel: channel
                    }]
                }
                ]
            });
            if (record) {
                return false;
            }
            else {
                return true;
            }
        }
        catch(err) {
            LoggerService.logError(err.message, 'mongoDB');
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

}
