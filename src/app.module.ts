import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ApolloModule } from './apollo/apollo.module';

@Module({
  imports: [ApolloModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
