import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { GiveawaysModule } from './giveaways/giveaways.module';
import { FeedsModule } from './feeds/feeds.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfileModule } from './profile/profile.module';
import { OrganizationModule } from './organization/organization.module';
import { AdminModule } from './admin/admin.module';
import databaseConfig from './config/database.config';
import apiConfig from './config/api.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, apiConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database'),
      inject: [ConfigService],
    }),
    AuthModule,
    HomeModule,
    GiveawaysModule,
    FeedsModule,
    MessagesModule,
    NotificationsModule,
    ProfileModule,
    OrganizationModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
