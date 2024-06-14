import { IsOptional } from "class-validator";

export class CreateNotificationDto {

  @IsOptional()
  recipientId?: number;

  type: string;

  content: string;

  contentDetail?: string;

  relatedId: number;

  toAllUsers: "ALL" | "ADMIN" | "PERSONAL";
}
