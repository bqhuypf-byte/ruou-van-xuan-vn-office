import { Column, Entity, PrimaryColumn } from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('addresses')
export class Address {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'bigint', name: 'user_id', transformer: bigintTransformer })
  userId: number;

  @Column({ type: 'varchar', length: 100, name: 'full_name' })
  fullName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, name: 'address_line' })
  addressLine: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'boolean', name: 'is_default', default: false })
  isDefault: boolean;
}
