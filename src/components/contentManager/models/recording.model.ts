import { Prop, Schema, SchemaFactory, InjectModel } from '@nestjs/mongoose';

@Schema()
export class Recording {

    @Prop()
    url: string;

    @Prop()
    isDeleting: boolean;
}

export const recordingSchema = SchemaFactory.createForClass(Recording);