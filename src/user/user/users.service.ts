import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { User } from './users.entity';
import { createUserDto } from './dto/createUser.dto';
import { updateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'firstName', 'email'],
    });
  }

  async create(data: createUserDto) {
    const user = new User();
    user.firstName = data.firstName;
    user.email = data.email;
    user.password = data.password;
    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      select: ['id', 'firstName', 'email'],
    });
    return user || null;
  }

  async update(id: number, data: updateUserDto): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    user.firstName = data.firstName;
    user.email = data.email;
    if (data.password !== undefined && data.password !== '') {
      user.password = data.password;
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  async checkEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      email: email,
    });
  }

  async checkEmailForUpdate(email: string, id: number): Promise<User | null> {
    return this.userRepository.findOneBy({
      id: Not(Equal(id)),
      email: email,
    });
  }
}
