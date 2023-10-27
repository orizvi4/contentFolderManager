import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from 'fs';
import { Recording } from "./models/recording.model";
import { Model } from "mongoose";

const bunyan = require('bunyan');
const logstashStream = require('bunyan-logstash-tcp').createStream({
    host: '127.0.0.1',
    port: 5000
});

const logger = bunyan.createLogger({
    elasticIndex: 'content-folder-manager',
    name: 'content-folder-manager',
    category: 'code',
    streams: [{
        stream: logstashStream
    }],
});

const CONTENT_PATH = 'C:/Program Files/Wowza Media Systems/Wowza Streaming Engine 4.8.24+4/content';
@Injectable()
export class ContentManagerService {
    constructor(@InjectModel(Recording.name) private readonly recordingModel: Model<Recording>) { }

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
                logger.error({category: 'mongoDB'}, "didn't delete the recording: " + file);
                return false;
            }
            logger.info("deleted the recording: " + file + " succesfully");
            return true;
        }
        catch (err) {
            logger.error( {category: 'content folder'}, err);
            return false;
        }
    }
}