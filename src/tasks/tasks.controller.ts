import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskStatus } from '../entities/Task';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('projectId', new ParseIntPipe({ optional: true }))
    projectId?: number,
    @Query('assigneeId', new ParseIntPipe({ optional: true }))
    assigneeId?: number,
  ) {
    return this.tasksService.findAll(status, projectId, assigneeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.tasksService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}