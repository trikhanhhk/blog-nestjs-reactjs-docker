import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { MailContextRegisterForm, MailContextRegisterGoogle } from "src/types/MailContextType";

@Processor('mailing')
export class EmailProcessor {
  constructor(private readonly mailerService: MailerService) { }

  private readonly logger = new Logger(EmailProcessor.name);

  @Process('sendMail')
  async sendMail(
    job: Job<
      {
        email: string, subject: string, template: string,
        context: MailContextRegisterGoogle | MailContextRegisterForm
      }
    >) {

    const { email, subject, template, context } = job.data;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template: template,
        context: context
      });

      this.logger.log(`Email sent to ${email} with subject ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email} with subject ${subject}`, error.stack);
    }
  }
}