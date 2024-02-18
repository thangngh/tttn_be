import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CartService } from "src/cart/cart.service";
import { MessageService } from "src/message/message.service";
import { NotificationService } from "src/notification/notification.service";
import { ProductService } from "src/product/product.service";

@WebSocketGateway({ transports: ['websocket'], cors: true })
export class UserGateWay implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger(UserGateWay.name);

	constructor(
		private readonly messageService: MessageService,
		private readonly notificationService: NotificationService,
		private readonly productService: ProductService,
		private readonly cartService: CartService
	) { }

	private data = [];
	async handleDisconnect(socket: Socket) {
		this.logger.log(`Client disconnected: -> ${socket.id}`);
	}

	async handleConnection(socket: Socket) {
		this.logger.log(`Client connected: ${socket.id}`);
	}

	@SubscribeMessage("online")
	async online(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
		this.logger.log(`Client online: ${socket.id}`);
		console.log(data)
	}

	@SubscribeMessage("user:order")
	async userOrder(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
		const { cartId, userOrderId } = data;
		for (const cart of cartId) {
			const cartRepository = await this.cartService.getShopByCartId(cart)

			const notification = await this.notificationService.create({
				content: 'user already order',
				userId: cartRepository.userid
			})
			this.server.emit("msg:user:order", notification)

			await this.messageService.createRoomMessage({
				fromId: cartRepository.userid,
				toId: userOrderId,
			})
		}

	}

	@SubscribeMessage("send-message")
	async sendMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
		const { fromId, toId, content, roomId } = data;
		const message = await this.messageService.saveMessage(roomId, {
			fromId,
			toId,
			content,
		})
		this.server.emit("msg:send-message", message)
	}


}