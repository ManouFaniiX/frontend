import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { Produit } from './produit.entity';
import { ProduitImage } from './produit-image.entity';
import { Categorie } from '../categories/categorie.entity';
import { Fournisseur } from '../fournisseurs/fournisseur.entity';
import { CreateProduitDto } from './dto/create-produit.dto';
import { ProduitsQueryDto } from './dto/produits-query.dto';

@Injectable()
export class ProduitsService {
  constructor(
    @InjectRepository(Produit)
    private readonly repo: Repository<Produit>,
    @InjectRepository(ProduitImage)
    private readonly imageRepo: Repository<ProduitImage>,
    @InjectRepository(Categorie)
    private readonly categorieRepo: Repository<Categorie>,
    @InjectRepository(Fournisseur)
    private readonly fournisseurRepo: Repository<Fournisseur>,
  ) {}

  async create(dto: CreateProduitDto) {
    const { categorieId, fournisseurIds, ...data } = dto;
    const entity = this.repo.create(data);

    entity.categorie = await this.loadCategorie(categorieId);

    if (fournisseurIds?.length) {
      entity.fournisseurs = await this.loadFournisseurs(fournisseurIds);
    }

    return this.repo.save(entity);
  }

  async findAll(query: ProduitsQueryDto) {
    const base = this.repo
      .createQueryBuilder('produit')
      .orderBy('produit.created_at', 'DESC');

    const filters: Array<[string, Record<string, unknown>]> = [];
    if (query.search) {
      filters.push([
        '(produit.nom ILIKE :search OR produit.code ILIKE :search)',
        { search: `%${query.search}%` },
      ]);
    }
    if (query.nom) {
      filters.push(['produit.nom ILIKE :nom', { nom: `%${query.nom}%` }]);
    }
    if (query.code) {
      filters.push(['produit.code ILIKE :code', { code: `%${query.code}%` }]);
    }
    if (query.categorieId) {
      filters.push([
        'produit.categorie_id = :categorieId',
        { categorieId: query.categorieId },
      ]);
    }
    if (query.fournisseurIds?.length) {
      filters.push([
        `EXISTS (
          SELECT 1 FROM produit_fournisseurs pf
          WHERE pf.produit_id = produit.id
            AND pf.fournisseur_id IN (:...fournisseurIds)
        )`,
        { fournisseurIds: query.fournisseurIds },
      ]);
    }
    if (query.prixMin !== undefined) {
      filters.push(['produit.prix >= :prixMin', { prixMin: query.prixMin }]);
    }
    if (query.prixMax !== undefined) {
      filters.push(['produit.prix <= :prixMax', { prixMax: query.prixMax }]);
    }
    if (query.stockMin !== undefined) {
      filters.push([
        'produit.stock >= :stockMin',
        { stockMin: query.stockMin },
      ]);
    }

    const qb = base
      .clone()
      .leftJoinAndSelect('produit.categorie', 'categorie')
      .leftJoinAndSelect('produit.fournisseurs', 'fournisseurs')
      .leftJoinAndSelect('produit.images', 'images');

    for (const [sql, params] of filters) {
      qb.andWhere(sql, params);
      base.andWhere(sql, params);
    }

    return this.paginate(qb, base, query);
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id },
      relations: { categorie: true, fournisseurs: true, images: true },
    });
    if (!entity) throw new NotFoundException('Produit introuvable');
    return entity;
  }

  async addImages(id: string, urls: string[]) {
    const entity = await this.findOne(id);
    entity.images = [
      ...(entity.images ?? []),
      ...urls.map((url) => this.imageRepo.create({ url })),
    ];
    return this.repo.save(entity);
  }

  async removeImage(id: string, imageId: string) {
    const entity = await this.findOne(id);
    const image = entity.images?.find((img) => img.id === imageId);
    if (!image) throw new NotFoundException('Image introuvable');
    entity.images = entity.images.filter((img) => img.id !== imageId);
    await this.repo.save(entity);
    await this.imageRepo.delete(imageId);
    return entity;
  }

  async update(id: string, dto: Partial<CreateProduitDto>) {
    const entity = await this.findOne(id);
    const { categorieId, fournisseurIds, ...data } = dto;
    Object.assign(entity, data);

    if (categorieId !== undefined) {
      entity.categorie = await this.loadCategorie(categorieId);
    }

    if (fournisseurIds !== undefined) {
      entity.fournisseurs = fournisseurIds.length
        ? await this.loadFournisseurs(fournisseurIds)
        : [];
    }

    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    return this.repo.remove(entity);
  }

  private async paginate<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    countQb: SelectQueryBuilder<T>,
    query: ProduitsQueryDto,
  ) {
    if (!query.page && !query.limit) return qb.getMany();
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [items, total] = await Promise.all([
      qb.skip((page - 1) * limit).take(limit).getMany(),
      countQb.getCount(),
    ]);
    return { items, total, page, limit };
  }

  private async loadCategorie(categorieId: string) {
    const categorie = await this.categorieRepo.findOne({
      where: { id: categorieId },
    });
    if (!categorie) throw new NotFoundException('Catégorie introuvable');
    return categorie;
  }

  private async loadFournisseurs(ids: string[]) {
    const found = await this.fournisseurRepo
      .createQueryBuilder('fournisseur')
      .where('fournisseur.id IN (:...ids)', { ids })
      .getMany();
    if (found.length !== ids.length) {
      throw new NotFoundException('Un ou plusieurs fournisseurs introuvables');
    }
    return found;
  }
}