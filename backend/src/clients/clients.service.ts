import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsQueryDto } from './dto/clients-query.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
  ) {}

  async create(dto: CreateClientDto) {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(query: ClientsQueryDto) {
    const base = this.repo
      .createQueryBuilder('client')
      .orderBy('client.created_at', 'DESC');

    const filters: Array<[string, Record<string, unknown>]> = [];
    if (query.search) {
      filters.push([
        '(client.nom ILIKE :search OR client.email ILIKE :search OR client.telephone ILIKE :search)',
        { search: `%${query.search}%` },
      ]);
    }
    if (query.nom) {
      filters.push(['client.nom ILIKE :nom', { nom: `%${query.nom}%` }]);
    }
    if (query.email) {
      filters.push(['client.email ILIKE :email', { email: `%${query.email}%` }]);
    }
    if (query.telephone) {
      filters.push([
        'client.telephone ILIKE :telephone',
        { telephone: `%${query.telephone}%` },
      ]);
    }

    const qb = base.clone().leftJoinAndSelect('client.factures', 'factures');

    for (const [sql, params] of filters) {
      qb.andWhere(sql, params);
      base.andWhere(sql, params);
    }

    return this.paginate(qb, base, query);
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id },
      relations: { factures: true },
    });
    if (!entity) throw new NotFoundException('Client introuvable');
    return entity;
  }

  async update(id: string, dto: Partial<CreateClientDto>) {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async updateImage(id: string, imageUrl: string) {
    const entity = await this.findOne(id);
    entity.imageUrl = imageUrl;
    return this.repo.save(entity);
  }

  async remove(id: string) {
    const entity = await this.findOne(id);
    return this.repo.remove(entity);
  }

  private async paginate<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    countQb: SelectQueryBuilder<T>,
    query: ClientsQueryDto,
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