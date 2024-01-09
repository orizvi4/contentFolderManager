import { Controller, Delete, Query, UseGuards } from "@nestjs/common";
import { ContentManagerService } from "./contentManager.service";
import { EditorGuard } from "src/common/guards/editor.guard";

@Controller()
export class ContentManagerController {
    constructor(private contentManagerService: ContentManagerService) {}

    @UseGuards(EditorGuard)
    @Delete('/delete')
    async deleteFile(@Query('file') file: string): Promise<boolean> {
        return await this.contentManagerService.deleteFile(file);
    }
}