import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class RecordingDelete extends Document {
    @Prop()
    recordingUrl: string;
}

export const recordingDeleteSchema = SchemaFactory.createForClass(RecordingDelete);