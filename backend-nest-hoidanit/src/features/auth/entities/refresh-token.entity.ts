import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'bigint', name: 'user_id', transformer: bigintTransformer })
  userId: number;

  @Column({ type: 'varchar', length: 255, unique: true, name: 'token_hash' })
  tokenHash: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'device_name' })
  deviceName: string | null;

  @Column({ type: 'varchar', length: 45, nullable: true, name: 'ip_address' })
  ipAddress: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'user_agent' })
  userAgent: string | null;

  @Column({ type: 'datetime', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false, name: 'is_revoked' })
  isRevoked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
