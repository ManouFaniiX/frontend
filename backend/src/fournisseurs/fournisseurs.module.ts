import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fournisseur } from './fournisseur.entity';
import { FournisseursController } from './fournisseurs.controller';
import { FournisseursService } from './fournisseurs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fournisseur])],
  controllers: [FournisseursController],
  providers: [FournisseursService],
  exports: [TypeOrmModule, FournisseursService],
})
export class FournisseursModule {}