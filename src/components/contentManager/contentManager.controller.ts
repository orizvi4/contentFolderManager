import { Controller, Delete, Query } from "@nestjs/common";
import { ContentManagerService } from "./contentManager.service";

@Controller()
export class ContentManagerController {
    constructor(private contentManagerService: ContentManagerService) {}

    @Delete('/delete')
    async deleteFile(@Query('file') file: string): Promise<boolean> {
        return await this.contentManagerService.deleteFile(file);
    }
}