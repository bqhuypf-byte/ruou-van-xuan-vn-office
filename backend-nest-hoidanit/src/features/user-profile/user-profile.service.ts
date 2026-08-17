import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressRepository } from './repositories/address.repository';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class UserProfileService {
  constructor(private readonly addressRepository: AddressRepository) {}

  findAll(userId: number): Promise<Address[]> {
    return this.addressRepository.findAllByUser(userId);
  }

  async findOne(id: number, userId: number): Promise<Address> {
    const address = await this.addressRepository.findByIdAndUser(id, userId);
    if (!address) {
      throw new NotFoundException(`Address #${id} not found`);
    }
    return address;
  }

  async create(userId: number, dto: CreateAddressDto): Promise<Address> {
    if (dto.isDefault) {
      await this.addressRepository.clearDefaultForUser(userId);
    }
    const address = this.addressRepository.create({ ...dto, userId });
    return this.addressRepository.save(address);
  }

  async update(
    id: number,
    userId: number,
    dto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(id, userId);

    if (dto.isDefault) {
      await this.addressRepository.clearDefaultForUser(userId, id);
    }

    Object.assign(address, dto);
    return this.addressRepository.save(address);
  }

  async setDefault(id: number, userId: number): Promise<Address> {
    const address = await this.findOne(id, userId);
    await this.addressRepository.clearDefaultForUser(userId, id);
    address.isDefault = true;
    return this.addressRepository.save(address);
  }

  async remove(id: number, userId: number): Promise<void> {
    const address = await this.findOne(id, userId);
    await this.addressRepository.remove(address);
  }
}
