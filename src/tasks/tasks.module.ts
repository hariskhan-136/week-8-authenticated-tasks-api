import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from '../entities/Project';
import { Tag } from '../entities/Tag';
import { Task } from '../entities/Task';
import { User } from '../entities/User';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, User, Tag])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
