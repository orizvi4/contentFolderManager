import { Body, Controller, FileTypeValidator, Get, ParseFilePipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImportFileService } from './importFile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Constants } from 'src/common/constants.class';
import { RecordingDTO } from './models/recordingDTO.interface';

@Controller()
export class ImportFileController {
  constructor(private importFileService: ImportFileService) { }

  @Post('/file/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage:
      diskStorage({
        destination: Constants.WOWZA_CONTENT_FOLDER,
        filename: (req, file, callback) => {
          const filename = `${req.query.channel}-rec.stream_${req.query.suffix}.mp4.mp4`;
          callback(null, filename);
        }
      })
  }))
  async uploadFile(@UploadedFile(new ParseFilePipe({
    validators: [new FileTypeValidator({
      fileType: 'mp4'
    })]
  })) file: Express.Multer.File, @Body() body: RecordingDTO, @Query('channel') channel: string, @Query('suffix') Suffix): Promise<boolean> {
    return await this.importFileService.addToDB(file.filename, channel, body.startAt, body.endAt);
  }

  @Get('/file/suffix')
  getSuffix(@Query('channel') channel: string): number {
    return this.importFileService.videoSuffix(channel)
  }

  @Post('file/date')
  async isDateValid(@Body() body: RecordingDTO): Promise<boolean> {
    return await this.importFileService.isDateValid(body.channel, body.startAt, body.endAt);
  }
}
