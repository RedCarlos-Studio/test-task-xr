import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  sendNotification(userId: string, payload: any): void {
    this.server.to(userId).emit('notification', payload);
  }

  @SubscribeMessage('register')
  handleRegister(@MessageBody() userId: string, client: any): void {
    client.join(userId);
  }
}

