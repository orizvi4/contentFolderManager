import { Module } from '@nestjs/common';
import { ContentManagerController } from './contentManager.controller';
import { ContentManagerService } from './contentManager.service';
import { Recording, recordingSchema } from './models/recording.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from 'src/common/services/token.service';
import { CommonModule } from 'src/common/common.module';
import { RecordingDelete, recordingDeleteSchema } from './models/recordingDelete.model';
import { RecordingDeleteService } from './services/recordingDelete.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Recording.name, schema: recordingSchema}, {name: RecordingDelete.name, schema: recordingDeleteSchema}]), CommonModule],
  controllers: [ContentManagerController],
  providers: [ContentManagerService, Recording, RecordingDeleteService],
  exports: [ContentManagerService, Recording, RecordingDeleteService]
})
export class ContentManagerModule {}