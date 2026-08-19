import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../entities/Project';
import { Tag } from '../entities/Tag';
import { Task, TaskStatus } from '../entities/Task';
import { User } from '../entities/User';

import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  const taskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const projectRepository = {
    findOne: jest.fn(),
  };

  const userRepository = {
    findOne: jest.fn(),
  };

  const tagRepository = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: taskRepository,
        },
        {
          provide: getRepositoryToken(Project),
          useValue: projectRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
        {
          provide: getRepositoryToken(Tag),
          useValue: tagRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should create a task', async () => {
    const project = {
      id: 1,
      name: 'Task Management System',
    } as Project;

    const assignee = {
      id: 1,
      name: 'Muhammad Haris',
      email: 'haris@gmail.com',
    } as User;

    const tags = [
      {
        id: 2,
        name: 'Backend',
      },
    ] as Tag[];

    const createdTask = {
      id: 16,
      title: 'Test Task',
      description: 'Test description',
      status: TaskStatus.TODO,
      priority: 3,
      project,
      assignee,
      tags,
    } as Task;

    const savedTask = {
      ...createdTask,
    };

    projectRepository.findOne.mockResolvedValue(project);
    userRepository.findOne.mockResolvedValue(assignee);
    tagRepository.findByIds.mockResolvedValue(tags);

    taskRepository.create.mockReturnValue(createdTask);
    taskRepository.save.mockResolvedValue(savedTask);
    taskRepository.findOne.mockResolvedValue(savedTask);

    const result = await service.create({
      title: 'Test Task',
      description: 'Test description',
      status: TaskStatus.TODO,
      priority: 3,
      projectId: 1,
      assigneeId: 1,
      tagIds: [2],
    });

    expect(result).toEqual(savedTask);
    expect(projectRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(tagRepository.findByIds).toHaveBeenCalledWith([2]);
    expect(taskRepository.create).toHaveBeenCalled();
    expect(taskRepository.save).toHaveBeenCalledWith(createdTask);
  });
});
