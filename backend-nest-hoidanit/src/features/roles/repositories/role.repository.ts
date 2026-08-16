import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
  ) {}

  findAll(): Promise<Role[]> {
    return this.repository.find();
  }

  findById(id: number): Promise<Role | null> {
    return this.repository.findOne({ where: { id } });
  }

  findByName(name: string): Promise<Role | null> {
    return this.repository.findOne({ where: { name } });
  }

  create(data: Partial<Role>): Role {
    return this.repository.create(data);
  }

  save(role: Role): Promise<Role> {
    return this.repository.save(role);
  }

  async remove(role: Role): Promise<void> {
    await this.repository.remove(role);
  }
}
