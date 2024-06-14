export type NotificationData = {
  id: number;
  recipientId: number;
  type: "COMMENT" | "REPORT_RESULT";
  content: string;
  contentDetail: string;
  relatedId: number;
  createdAt: string;
  read: boolean;
};