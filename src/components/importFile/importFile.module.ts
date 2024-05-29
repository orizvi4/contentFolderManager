import { Module } from '@nestjs/common';
import { ImportFileController } from './importFile.controller';
import { ImportFileService } from './importFile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recording, recordingSchema } from './models/recording.model';
import { TokenService } from 'src/common/services/token.service';
import { CommonModule } from 'src/common/common.module';
import { ContentManagerService } from '../contentManager/contentManager.service';
import { ContentManagerModule } from '../contentManager/contentManager.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Recording.name, schema: recordingSchema }]), CommonModule, ContentManagerModule],
  controllers: [ImportFileController],
  providers: [ImportFileService, TokenService],
})
export class ImportFileModule {}