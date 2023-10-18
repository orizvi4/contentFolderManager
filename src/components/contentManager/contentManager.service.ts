import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as fs from 'fs';
import { Recording } from "./models/recording.model";
import { Model } from "mongoose";

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
                    resolve('File deleted successfully');
                });
            })
            const res = await this.recordingModel.deleteOne({ url: `${CONTENT_PATH}/${file}` });
            if (res == null) {
                return false;
            }
            console.log("deleted succesfully");
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}