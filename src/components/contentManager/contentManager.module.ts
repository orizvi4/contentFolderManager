import { Module } from '@nestjs/common';
import { ContentManagerController } from './contentManager.controller';
import { ContentManagerService } from './contentManager.service';
import { Recording, recordingSchema } from './models/recording.model';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenService } from 'src/common/services/token.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [MongooseModule.forFeature([{name: Recording.name, schema: recordingSchema}]), CommonModule],
  controllers: [ContentManagerController],
  providers: [ContentManagerService, Recording],
})
export class ContentManagerModule {}