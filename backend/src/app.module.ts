import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { StorageModule } from './storage/storage.module';
import { CategoriesModule } from './categories/categories.module';
import { ProduitsModule } from './produits/produits.module';
import { FournisseursModule } from './fournisseurs/fournisseurs.module';
import { ClientsModule } from './clients/clients.module';
import { FacturesModule } from './factures/factures.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const sslMode = (config.get<string>('PGSSLMODE') ?? '').toLowerCase();
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST') ?? process.env.PGHOST,
          port:
            config.get<number>('DB_PORT') ??
            (process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432),
          username: config.get<string>('DB_USERNAME') ?? process.env.PGUSER,
          password: config.get<string>('DB_PASSWORD') ?? process.env.PGPASSWORD,
          database: config.get<string>('DB_DATABASE') ?? process.env.PGDATABASE,
          ssl:
            sslMode === 'require' || sslMode === 'verify-ca' || sslMode === 'verify-full'
              ? { rejectUnauthorized: false }
              : undefined,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize:
            config.get<string>('NODE_ENV') !== 'production' ||
            config.get<string>('DB_SYNCHRONIZE') === 'true',
          logging: config.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    UsersModule,
    AuthModule,
    SeedModule,
    StorageModule,
    CategoriesModule,
    ProduitsModule,
    FournisseursModule,
    ClientsModule,
    FacturesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
