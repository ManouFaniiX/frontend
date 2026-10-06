import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produit } from './produit.entity';
import { ProduitImage } from './produit-image.entity';
import { Categorie } from '../categories/categorie.entity';
import { Fournisseur } from '../fournisseurs/fournisseur.entity';
import { ProduitsController } from './produits.controller';
import { ProduitsService } from './produits.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produit, ProduitImage, Categorie, Fournisseur]),
    StorageModule,
  ],
  controllers: [ProduitsController],
  providers: [ProduitsService],
  exports: [TypeOrmModule, ProduitsService],
})
export class ProduitsModule {}