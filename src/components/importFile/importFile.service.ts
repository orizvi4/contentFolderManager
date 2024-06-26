import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { Constants } from 'src/common/constants.class';
import { Recording } from './models/recording.model';
import { RecordingDTO } from './models/recordingDTO.interface';
import { LoggerService } from 'src/common/services/logger.service';
import getVideoDurationInSeconds from 'get-video-duration';
import { resolve } from 'path';
import { ContentManagerService } from '../contentManager/contentManager.service';



@Injectable()
export class ImportFileService {
    constructor(@InjectModel(Recording.name) private recordingModel: Model<Recording>,
    private contentFolderManagerService: ContentManagerService) { }

    async addToDB(name: string, channel: string, start: Date): Promise<boolean> {
        try {
            const filePath = `${Constants.WOWZA_CONTENT_FOLDER}/${name}`;
            const duration = await this.getVideoLength(filePath);
            if (await this.isDateValid(channel, start, new Date((new Date(start)).getTime() + duration * 1000)) !== true) {
                await this.contentFolderManagerService.deleteFile(name, true);
                return false;
            }

            const recordingEntity: RecordingDTO = {
                channel: channel,
                isDeleting: false,
                startAt: new Date(start + 'Z'),
                endAt: new Date((new Date(start + 'Z')).getTime() + duration * 1000),
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

    public async getVideoLength(filePath: string): Promise<number> {
        return Math.ceil(await getVideoDurationInSeconds(filePath));
    }

    public videoSuffix(channel: string) {
        const folderPath = Constants.WOWZA_CONTENT_FOLDER;
        try {

            const files: Array<string> = fs.readdirSync(folderPath);
            let numbers: Array<number> = files.map((name) => {
                if (name.indexOf(channel + "-rec") == 0) {
                    const start: number = name.indexOf('_') + 1;
                    const end: number = name.indexOf(".mp4");
                    return Number(name.substring(start, end));
                }
            });
            numbers.sort((a, b) => a - b);
            numbers = numbers.filter((item) => {
                if (item !== undefined) {
                    return true;
                }
            });
            for (let i: number = 0; i < numbers.length; i++) {
                if (i != numbers[i]) {
                    return i;
                }
                else if (i + 1 == numbers.length) {
                    return i + 1;
                }
            }
            return -1;
        }
        catch (err) {
            LoggerService.logError(err.message, 'file folder');
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    public async isDateValid(channel: string, start: Date, end: Date): Promise<boolean> {
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
        catch (err) {
            LoggerService.logError(err.message, 'mongoDB');
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

}
