import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Produit } from '../produits/produit.entity';

@Entity('categories')
export class Categorie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  nom: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => Categorie, (categorie) => categorie.sousCategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Categorie | null;

  @OneToMany(() => Categorie, (categorie) => categorie.parent)
  sousCategories: Categorie[];

  @OneToMany(() => Produit, (produit) => produit.categorie)
  produits: Produit[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}