import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { Facture } from './facture.entity';
import { Client } from '../clients/client.entity';
import { CreateFactureDto } from './dto/create-facture.dto';
import { FacturesQueryDto } from './dto/factures-query.dto';

@Injectable()
export class FacturesService {
  constructor(
    @InjectRepository(Facture)
    private readonly repo: Repository<Facture>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {}

  async create(dto: CreateFactureDto) {
    const { clientId, numeroFacture, ...data } = dto;
    const entity = this.repo.create({
      ...data,
      numeroFacture: numeroFacture ?? this.generateNumero(),
    });

    entity.client = await this.loadClient(clientId);

    return this.repo.save(entity);
  }

  async findAll(query: FacturesQueryDto) {
    const base = this.repo
      .createQueryBuilder('facture')
      .orderBy('facture.created_at', 'DESC');

    const filters: Array<[string, Record<string, unknown>]> = [];
    if (query.search) {
      filters.push([
        'facture.numero_facture ILIKE :search',
        { search: `%${query.search}%` },
      ]);
    }
    if (query.numeroFacture) {
      filters.push([
        'facture.numero_facture ILIKE :numeroFacture',
        { numeroFacture: `%${query.numeroFacture}%` },
      ]);
    }
    if (query.statut) {
      filters.push(['facture.statut = :statut', { statut: query.statut }]);
    }
    if (query.clientId) {
      filters.push(['facture.client_id = :clientId', { clientId: query.clientId }]);
    }

    const qb = base.clone().leftJoinAndSelect('facture.client', 'client');

    for (const [sql, params] of filters) {
      qb.andWhere(sql, params);
      base.andWhere(sql, params);
    }

    return this.paginate(qb, base, query);
  }

  async findOne(id: string) {
    const entity = await this.repo.findOne({
      where: { id },
      relations: { client: true },
    });
    if (!entity) throw new NotFoundException('Facture introuvable');
    return entity;
  }

  async update(id: string, dto: Partial<CreateFactureDto>) {
    const entity = await this.findOne(id);
    const { clientId, ...data } = dto;
    Object.assign(entity, data);

    if (clientId !== undefined) {
      entity.client = await this.loadClient(clientId);
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
    query: FacturesQueryDto,
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

  private async loadClient(clientId: string) {
    const client = await this.clientRepo.findOne({ where: { id: clientId } });
    if (!client) throw new NotFoundException('Client introuvable');
    return client;
  }

  private generateNumero(): string {
    return `FAC-${Date.now()}`;
  }
}