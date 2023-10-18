import { Prop, Schema, SchemaFactory, InjectModel } from '@nestjs/mongoose';

@Schema()
export class Recording {

    @Prop()
    url: string;
}

export const recordingSchema = SchemaFactory.createForClass(Recording);