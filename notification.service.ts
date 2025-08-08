import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

export type NotificationDTO = any;

@Injectable()
export class NotificationsService {
  constructor(
    private readonly gateway: NotificationsGateway,
    // Placeholder for a DB handler/ORM. Replace with your actual dependency.
    private readonly db: any,
  ) {}

  async createNotification(userId: string, payload: NotificationDTO): Promise<void> {
    const data = payload;

    // Optional persistence if a DB instance is provided
    if (this.db) {
      await this.db('notifications').insert({ userId, payload: data });
    }

    this.gateway.sendNotification(userId, data);
  }
}

