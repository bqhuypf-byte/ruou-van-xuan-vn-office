import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressRepository {
  constructor(
    @InjectRepository(Address)
    private readonly repository: Repository<Address>,
  ) {}

  findAllByUser(userId: number): Promise<Address[]> {
    return this.repository.find({ where: { userId } });
  }

  findByIdAndUser(id: number, userId: number): Promise<Address | null> {
    return this.repository.findOne({ where: { id, userId } });
  }

  create(data: Partial<Address>): Address {
    return this.repository.create(data);
  }

  save(address: Address): Promise<Address> {
    return this.repository.save(address);
  }

  async remove(address: Address): Promise<void> {
    await this.repository.remove(address);
  }

  async clearDefaultForUser(userId: number, excludeId?: number): Promise<void> {
    const qb = this.repository
      .createQueryBuilder()
      .update(Address)
      .set({ isDefault: false })
      .where('user_id = :userId', { userId });

    if (excludeId !== undefined) {
      qb.andWhere('id != :excludeId', { excludeId });
    }

    await qb.execute();
  }
}
