import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentManagerModule } from './components/contentManager/contentManager.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportFileModule } from './components/importFile/importFile.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerExceptionFilter } from './common/filters/throttlerException.filter';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ImportFileModule, CommonModule, ContentManagerModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/database'),
    ThrottlerModule.forRoot([{
      ttl: 1000,
      limit: 12,
    }])],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }, {
    provide: APP_FILTER,
    useClass: ThrottlerExceptionFilter,
  }],
})
export class AppModule { }
