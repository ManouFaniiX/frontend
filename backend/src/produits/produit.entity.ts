import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categorie } from '../categories/categorie.entity';
import { Fournisseur } from '../fournisseurs/fournisseur.entity';
import { ProduitImage } from './produit-image.entity';

@Entity('produits')
export class Produit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  nom: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  prix: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @ManyToOne(() => Categorie, (categorie) => categorie.produits, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categorie_id' })
  categorie: Categorie;

  @ManyToMany(() => Fournisseur, (fournisseur) => fournisseur.produits)
  @JoinTable({
    name: 'produit_fournisseurs',
    joinColumn: { name: 'produit_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'fournisseur_id', referencedColumnName: 'id' },
  })
  fournisseurs: Fournisseur[];

  @OneToMany(() => ProduitImage, (image) => image.produit, { cascade: true })
  images: ProduitImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}