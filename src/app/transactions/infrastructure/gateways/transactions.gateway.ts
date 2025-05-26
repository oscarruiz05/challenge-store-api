import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TransactionsGateway {
  @WebSocketServer()
  server: Server;

  emitStatusUpdate(transactionId: string, status: string) {
    this.server.emit(`transaction-status-${transactionId}`, {
      transactionId,
      payment_status: status,
    });
  }
}
