import { Module } from '@nestjs/common';
import { ApolloService } from './apollo.service';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { OpenAIService } from './openAI.service';
import { GoogleAIService } from './googleAI.service';

@Module({
  imports: [ConfigModule],
  providers: [ApolloService, AiService, OpenAIService, GoogleAIService],
  exports: [ApolloService, AiService],
})
export class ProvidersModule {}
