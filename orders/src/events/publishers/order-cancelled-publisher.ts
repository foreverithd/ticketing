import { Subjects, Publisher, OrderCancelledEvent } from '@sritkt/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
