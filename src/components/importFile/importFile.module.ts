import { Module } from '@nestjs/common';
import { ImportFileController } from './importFile.controller';
import { ImportFileService } from './importFile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recording, recordingSchema } from './models/recording.model';
import { LoggerService } from 'src/common/services/logger.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Recording.name, schema: recordingSchema }])],
  controllers: [ImportFileController],
  providers: [ImportFileService, LoggerService],
})
export class ImportFileModule {}