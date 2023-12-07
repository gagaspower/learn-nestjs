import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password !== this._originalPassword) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @AfterLoad()
  setOriginalPassword() {
    this._originalPassword = this.password;
  }
  private _originalPassword: string;
}
