import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as SendGrid from "@sendgrid/mail";
import { ErrorDto } from "src/types/error.dto";

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get("SENDGRID_API_KEY"));
  }

  async sendEmail(to: string, data: any): Promise<ErrorDto> {
    try {
      const msg = {
        to,
        from: {
          email: this.configService.get("SENDGRID_FROM_EMAIL"),
          name: this.configService.get("SENDGRID_FROM_NAME")
        },
        templateId: this.configService.get("SENDGRID_TEMPLATE"),
        dynamicTemplateData: data
      };
      await SendGrid.send(msg);

      return null;
    } catch (error) {
      console.log(error);
      console.log(error.response.body);
      return { message: error.message, status: 500 };
    }
  }
}