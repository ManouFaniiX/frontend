import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { Categorie } from './categorie.entity';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { CategoriesQueryDto } from './dto/categories-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categorie)
    private readonly repo: Repository<Categorie>,
  ) {}

  async create(dto: CreateCategorieDto) {
    const { parentId, ...data } = dto;
    const entity = this.repo.create(data);

    if (parentId) {
      entity.parent = await this.loadParent(parentId);
    }

    return this.repo.save(entity);
  }

  async findAll(query: CategoriesQueryDto) {
    const base = this.repo
      .createQueryBuilder('categorie')
      .orderBy('categorie.created_at', 'DESC');

    const filters: Array<[string, Record<string, unknown>]> = [];
    if (query.search) {
      filters.push([
        '(categorie.nom ILIKE :search OR categorie.code ILIKE :search)',
        { search: `%${query.search}%` },
      ]);
    }
    if (query.nom) {
      filters.push(['categorie.nom ILIKE :nom', { nom: `%${query.nom}%` }]);
    }
    if (query.code) {
      filters.push(['categorie.code ILIKE :code', { code: `%${query.code}%` }]);
    }
    if (query.parentId) {
      filters.push(['categorie.parent_id = :parentId', { parentId: query.parentId }]);
    }

    const qb = base
      .clone()
      .leftJoinAndSelect('categorie.parent', 'parent')
      .leftJoinAndSelect('categorie.sousCategories', 'sousCategories')
      .leftJoinAndSelect('categorie.produits', 'produits');

    for (const [sql, params] of filters) {
      qb.andWhere(sql, params);
      base.andWhere(sql, params);
    }

    return this.paginate(qb, base, query);
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id },
      relations: { parent: true, sousCategories: true, produits: true },
    });
    if (!entity) throw new NotFoundException('Catégorie introuvable');
    return entity;
  }

  async update(id: string, dto: Partial<CreateCategorieDto>) {
    const entity = await this.findOne(id);
    const { parentId, ...data } = dto;
    Object.assign(entity, data);

    if (parentId !== undefined) {
      entity.parent = parentId ? await this.loadParent(parentId) : null;
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
    query: CategoriesQueryDto,
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

  private async loadParent(parentId: string) {
    const parent = await this.repo.findOne({ where: { id: parentId } });
    if (!parent) throw new NotFoundException('Catégorie parente introuvable');
    return parent;
  }
}