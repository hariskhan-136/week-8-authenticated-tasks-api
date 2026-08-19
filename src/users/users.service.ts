import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/User';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }
}
