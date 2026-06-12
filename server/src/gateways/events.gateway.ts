import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Remove user mapping
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        this.server.emit('USER_OFFLINE', { userId });
        break;
      }
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('REGISTER')
  handleRegister(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    this.userSockets.set(data.userId, client.id);
    console.log(`User ${data.userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('SET_AVAILABLE')
  handleSetAvailable(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string; zone: string; topics: string }) {
    this.server.emit('USER_AVAILABLE', data);
  }

  @SubscribeMessage('SET_BUSY')
  handleSetBusy(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string }) {
    this.server.emit('USER_BUSY', data);
  }

  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
