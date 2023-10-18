import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentManagerModule } from './components/contentManager/contentManager.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ContentManagerModule, MongooseModule.forRoot('mongodb://127.0.0.1:27017/database')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
