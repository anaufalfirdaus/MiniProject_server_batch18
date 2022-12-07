import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerModule } from './server/server.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'MiniProjectBatch18',
      entities: ['src/entities/*{.ts,.js}'],
      synchronize: false,
    }),
    ServerModule,
  ],
  controllers: [],
})
export class AppModule {}
