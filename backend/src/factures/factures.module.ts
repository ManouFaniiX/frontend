import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facture } from './facture.entity';
import { Client } from '../clients/client.entity';
import { FacturesController } from './factures.controller';
import { FacturesService } from './factures.service';

@Module({
  imports: [TypeOrmModule.forFeature([Facture, Client])],
  controllers: [FacturesController],
  providers: [FacturesService],
  exports: [TypeOrmModule, FacturesService],
})
export class FacturesModule {}