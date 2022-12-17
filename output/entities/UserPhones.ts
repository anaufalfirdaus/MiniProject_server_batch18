import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { PhoneNumberType } from "./PhoneNumberType";

@Index("user_phones_pkey", ["uspoNumberId"], { unique: true })
@Entity("user_phones", { schema: "public" })
export class UserPhones {
  @PrimaryGeneratedColumn({ type: "integer", name: "uspo_number_id" })
  uspoNumberId: number;

  @Column("character varying", {
    name: "uspo_entity_ud",
    nullable: true,
    length: 15,
  })
  uspoEntityUd: string | null;

  @Column("timestamp without time zone", {
    name: "uspo_modified_date",
    nullable: true,
  })
  uspoModifiedDate: Date | null;

  @ManyToOne(() => Users, (users) => users.userPhones)
  @JoinColumn([
    { name: "uspo_entity_id", referencedColumnName: "userEntityId" },
  ])
  uspoEntity: Users;

  @ManyToOne(
    () => PhoneNumberType,
    (phoneNumberType) => phoneNumberType.userPhones
  )
  @JoinColumn([{ name: "uspo_ponty_code", referencedColumnName: "pontyCode" }])
  uspoPontyCode: PhoneNumberType;
}
