import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { Fournisseur } from './fournisseur.entity';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { FournisseursQueryDto } from './dto/fournisseurs-query.dto';

@Injectable()
export class FournisseursService {
  constructor(
    @InjectRepository(Fournisseur)
    private readonly repo: Repository<Fournisseur>,
  ) {}

  async create(dto: CreateFournisseurDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(query: FournisseursQueryDto) {
    const base = this.repo
      .createQueryBuilder('fournisseur')
      .orderBy('fournisseur.created_at', 'DESC');

    const filters: Array<[string, Record<string, unknown>]> = [];
    if (query.search) {
      filters.push([
        '(fournisseur.nom ILIKE :search OR fournisseur.email ILIKE :search OR fournisseur.telephone ILIKE :search)',
        { search: `%${query.search}%` },
      ]);
    }
    if (query.nom) {
      filters.push(['fournisseur.nom ILIKE :nom', { nom: `%${query.nom}%` }]);
    }
    if (query.email) {
      filters.push([
        'fournisseur.email ILIKE :email',
        { email: `%${query.email}%` },
      ]);
    }
    if (query.telephone) {
      filters.push([
        'fournisseur.telephone ILIKE :telephone',
        { telephone: `%${query.telephone}%` },
      ]);
    }

    const qb = base
      .clone()
      .leftJoinAndSelect('fournisseur.produits', 'produits');

    for (const [sql, params] of filters) {
      qb.andWhere(sql, params);
      base.andWhere(sql, params);
    }

    return this.paginate(qb, base, query);
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id },
      relations: { produits: true },
    });
    if (!entity) throw new NotFoundException('Fournisseur introuvable');
    return entity;
  }

  async update(id: string, dto: Partial<CreateFournisseurDto>) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    return this.repo.remove(entity);
  }

  private async paginate<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    countQb: SelectQueryBuilder<T>,
    query: FournisseursQueryDto,
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
}