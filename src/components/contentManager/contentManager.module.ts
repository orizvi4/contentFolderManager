import { Module } from '@nestjs/common';
import { ContentManagerController } from './contentManager.controller';
import { ContentManagerService } from './contentManager.service';
import { Recording, recordingSchema } from './models/recording.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{name: Recording.name, schema: recordingSchema}])],
  controllers: [ContentManagerController],
  providers: [ContentManagerService, Recording],
})
export class ContentManagerModule {}