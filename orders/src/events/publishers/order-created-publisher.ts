import { Publisher, OrderCreatedEvent, Subjects } from '@sritkt/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
