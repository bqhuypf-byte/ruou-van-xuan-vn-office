import { Column, Entity, PrimaryColumn } from 'typeorm';
import { bigintTransformer } from '../../../shared/utils/bigint.transformer';

@Entity('roles')
export class Role {
  @PrimaryColumn({
    type: 'bigint',
    generated: 'increment',
    transformer: bigintTransformer,
  })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;
}
