import { Injectable } from '@nestjs/common';
import { MailContextRegisterForm, MailContextRegisterGoogle } from 'src/types/MailContextType';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class EmailService {

  constructor(
    @InjectQueue('mailing') private readonly mailQueue: Queue
  ) { }

  sendMail(
    email: string, subject: string, template: string,
    context: { [name: string]: any }
  ) {
    this.mailQueue.add('sendMail', { email, subject, template, context });
  }
}
