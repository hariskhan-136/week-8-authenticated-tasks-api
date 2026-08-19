import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../entities/Project';
import { Tag } from '../entities/Tag';
import { Task, TaskStatus } from '../entities/Task';
import { User } from '../entities/User';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(
    status?: TaskStatus,
    projectId?: number,
    assigneeId?: number,
  ): Promise<Task[]> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.tags', 'tags');

    if (status !== undefined) {
      query.andWhere('task.status = :status', { status });
    }

    if (projectId !== undefined) {
      query.andWhere('project.id = :projectId', { projectId });
    }

    if (assigneeId !== undefined) {
      query.andWhere('assignee.id = :assigneeId', { assigneeId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: {
        project: true,
        assignee: true,
        tags: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    let assignee: User | null = null;

    if (dto.assigneeId !== undefined) {
      assignee = await this.userRepository.findOne({
        where: { id: dto.assigneeId },
      });

      if (!assignee) {
        throw new NotFoundException(`User with ID ${dto.assigneeId} not found`);
      }
    }

    let tags: Tag[] = [];

    if (dto.tagIds !== undefined) {
      tags = await this.tagRepository.findByIds(dto.tagIds);

      if (tags.length !== dto.tagIds.length) {
        throw new NotFoundException('One or more tags were not found');
      }
    }

    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status,
      priority: dto.priority,
      project,
      assignee,
      tags,
    });

    const savedTask = await this.taskRepository.save(task);

    return this.findOne(savedTask.id);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (dto.projectId !== undefined) {
      const project = await this.projectRepository.findOne({
        where: { id: dto.projectId },
      });

      if (!project) {
        throw new NotFoundException(
          `Project with ID ${dto.projectId} not found`,
        );
      }

      task.project = project;
    }

    if (dto.assigneeId !== undefined) {
      const assignee = await this.userRepository.findOne({
        where: { id: dto.assigneeId },
      });

      if (!assignee) {
        throw new NotFoundException(`User with ID ${dto.assigneeId} not found`);
      }

      task.assignee = assignee;
    }

    if (dto.tagIds !== undefined) {
      const tags = await this.tagRepository.findByIds(dto.tagIds);

      if (tags.length !== dto.tagIds.length) {
        throw new NotFoundException('One or more tags were not found');
      }

      task.tags = tags;
    }

    if (dto.title !== undefined) {
      task.title = dto.title;
    }

    if (dto.description !== undefined) {
      task.description = dto.description;
    }

    if (dto.status !== undefined) {
      task.status = dto.status;
    }

    if (dto.priority !== undefined) {
      task.priority = dto.priority;
    }

    await this.taskRepository.save(task);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);

    await this.taskRepository.remove(task);
  }
}
