import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
  pollIntervals: {
    notifications: parseInt(process.env.POLL_INTERVAL_NOTIFICATIONS, 10) || 10000,
    messages: parseInt(process.env.POLL_INTERVAL_MESSAGES, 10) || 5000,
    feeds: parseInt(process.env.POLL_INTERVAL_FEEDS, 10) || 30000,
    giveaways: parseInt(process.env.POLL_INTERVAL_GIVEAWAYS, 10) || 30000,
  },
}));

