
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';
dotenv.config();

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
};

@Module({
  imports: [SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
