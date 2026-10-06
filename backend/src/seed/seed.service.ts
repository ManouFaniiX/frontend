import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedInitialUser();
  }

  private async seedInitialUser() {
    const existing = await this.userRepository.findOne({
      where: { email: 'user@example.com' },
    });
    if (existing) {
      this.logger.log('Initial user already exists, skipping seed');
      return;
    }

    const hashedPassword = await bcrypt.hash('123456789', 10);

    await this.userRepository.save({
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'Nameno',
      lastName: 'Rakotondrazaka',
      isActive: true,
    });

    this.logger.log('Initial user seeded successfully');
  }
}
