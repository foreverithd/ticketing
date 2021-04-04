import { Subjects, Publisher, ExpirationCompleteEvent } from '@sritkt/common';

export class ExpirateCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
