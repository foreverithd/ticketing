import { Message } from 'node-nats-streaming';

import { Listener, OrderCreatedEvent, Subjects } from '@sritkt/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // thrown an error if ticket not found
    if (!ticket) throw new Error('Ticket not found');

    // update the order id on the located ticket
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      // @ts-ignore
      orderId: ticket.orderId,
    });

    // ack the msg
    msg.ack();
  }
}
