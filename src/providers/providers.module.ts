import { Module } from '@nestjs/common';
import { ApolloService } from './apollo.service';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';

@Module({
  imports: [ConfigModule],
  providers: [ApolloService, AiService],
  exports: [ApolloService, AiService],
})
export class ProvidersModule {}
