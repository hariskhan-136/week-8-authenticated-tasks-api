import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../entities/Project';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: {
        owner: true,
      },
    });
  }

  findOne(id: number): Promise<Project | null> {
    return this.projectRepository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });
  }
}
