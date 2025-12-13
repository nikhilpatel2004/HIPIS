import { Notification } from "../models/Notification";

export async function createNotification(params: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  const { userId, title, message, type = "info", link = "" } = params;
  const notification = new Notification({ userId, title, message, type, link });
  await notification.save();
  return notification;
}
