import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('carts')
export class Cart {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'user_id',
    nullable: true,
    transformer: bigintTransformer,
  })
  userId: number | null;

  @Column({ type: 'varchar', length: 100, name: 'session_id', nullable: true })
  sessionId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
