import { Logger } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ transports: ['websocket'], cors: true })
export class UserGateWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(UserGateWay.name)
	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		console.log("Init")
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(socket: Socket) {
		this.logger.log(`Client connected: ${socket.id}`);
	}

	@SubscribeMessage('send-Message')
	async handleSendMessage(client: Socket, payload: any): Promise<void> {
		this.server.emit('receive-Message', payload);
	}
}