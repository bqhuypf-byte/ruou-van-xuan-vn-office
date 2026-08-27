import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.repository.findOne({ where: { tokenHash } });
  }

  create(data: Partial<RefreshToken>): RefreshToken {
    return this.repository.create(data);
  }

  save(token: RefreshToken): Promise<RefreshToken> {
    return this.repository.save(token);
  }

  async revoke(token: RefreshToken): Promise<void> {
    token.isRevoked = true;
    await this.repository.save(token);
  }

  async revokeAllForUser(userId: number): Promise<void> {
    await this.repository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({ expiresAt: LessThan(new Date()) });
  }
}
