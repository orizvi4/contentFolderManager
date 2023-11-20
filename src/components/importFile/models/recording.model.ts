import { Prop, Schema, SchemaFactory, InjectModel } from '@nestjs/mongoose';

@Schema()
export class Recording {

    @Prop()
    url: string;

    @Prop()
    startAt: Date;

    @Prop()
    endAt: Date;

    @Prop({type: String, ref: 'channel'})
    channel: string;

}

export const recordingSchema = SchemaFactory.createForClass(Recording);