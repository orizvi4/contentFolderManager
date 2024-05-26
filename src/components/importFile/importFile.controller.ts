import { Body, Controller, FileTypeValidator, Get, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImportFileService } from './importFile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Constants } from 'src/common/constants.class';
import { RecordingDTO } from './models/recordingDTO.interface';
import { EditorGuard } from 'src/common/guards/editor.guard';

@Controller()
export class ImportFileController {
  constructor(private importFileService: ImportFileService) { }

  @UseGuards(EditorGuard)
  @Post('/file/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage:
      diskStorage({
        destination: Constants.WOWZA_CONTENT_FOLDER,
        filename: (req, file, callback) => {
          const filename = `${req.query.channel}-rec.stream_${req.query.suffix}.mp4`;
          console.log(file);
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

  @UseGuards(EditorGuard)
  @Get('/file/suffix')
  getSuffix(@Query('channel') channel: string): number {
    return this.importFileService.videoSuffix(channel)
  }

  @UseGuards(EditorGuard)
  @Post('file/date')
  async isDateValid(@Body() body: RecordingDTO): Promise<boolean> {
    return await this.importFileService.isDateValid(body.channel, body.startAt, body.endAt);
  }
}
