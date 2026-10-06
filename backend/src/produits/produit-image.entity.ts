import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Produit } from './produit.entity';

@Entity('produit_images')
export class ProduitImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @ManyToOne(() => Produit, (produit) => produit.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'produit_id' })
  produit: Produit;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}