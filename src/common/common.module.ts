import { Module } from "@nestjs/common";
import { TokenService } from "./services/token.service";
import { WebsocketService } from "./services/websocket.service";

@Module({
    providers: [TokenService, WebsocketService],
    exports: [TokenService, WebsocketService]
})
export class CommonModule {}