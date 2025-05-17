import { Module } from '@nestjs/common';
import { ApolloService } from './apollo.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ApolloService],
  exports: [ApolloService],
})
export class ApolloModule {}
