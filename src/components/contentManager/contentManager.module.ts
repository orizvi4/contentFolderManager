import { Module } from '@nestjs/common';
import { ContentManagerController } from './contentManager.controller';
import { ContentManagerService } from './contentManager.service';
import { Recording, recordingSchema } from './models/recording.model';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from 'src/common/services/logger.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Recording.name, schema: recordingSchema}])],
  controllers: [ContentManagerController],
  providers: [ContentManagerService, Recording, LoggerService],
})
export class ContentManagerModule {}