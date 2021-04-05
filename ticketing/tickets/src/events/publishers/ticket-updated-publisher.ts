import { Publisher, Subjects, TicketUpdatedEvent } from '@sritkt/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
