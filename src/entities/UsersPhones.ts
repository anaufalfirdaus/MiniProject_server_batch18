import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { PhoneNumberType } from './PhoneNumberType';

@Index('users_phones_pkey', ['uspoPhoneId'], { unique: true })
@Entity('users_phones', { schema: 'public' })
export class UsersPhones {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'uspo_phone_id' })
  uspoPhoneId: number;

  @Column('character varying', {
    name: 'uspo_phone',
    nullable: true,
    length: 15,
  })
  uspoPhone: string | null;

  @Column('timestamp without time zone', {
    name: 'uspo_modified_date',
    nullable: true,
  })
  uspoModifiedDate: Date | null;

  @ManyToOne(() => Users, (users) => users.usersPhones)
  @JoinColumn([
    { name: 'uspo_entity_id', referencedColumnName: 'userEntityId' },
  ])
  uspoEntity: Users;

  @ManyToOne(
    () => PhoneNumberType,
    (phoneNumberType) => phoneNumberType.usersPhones,
  )
  @JoinColumn([{ name: 'uspo_ponty_code', referencedColumnName: 'pontyCode' }])
  uspoPontyCode: PhoneNumberType;
}
