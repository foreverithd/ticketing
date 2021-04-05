import { Publisher, Subjects, TicketCreatedEvent } from '@sritkt/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
