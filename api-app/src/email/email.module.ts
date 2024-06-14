import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mailing',
    }),
  ],
  // controllers: [EmailController],
  providers: [EmailService, EmailProcessor]
})
export class EmailModule { }
