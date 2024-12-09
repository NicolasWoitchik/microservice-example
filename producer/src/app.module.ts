import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

const RABBITMQ_URI =
  process.env.RABBITMQ_URI || 'amqp://rabbitmq:rabbitmq@localhost:5672';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'business_events',
          type: 'topic',
        },
      ],
      uri: RABBITMQ_URI,
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
