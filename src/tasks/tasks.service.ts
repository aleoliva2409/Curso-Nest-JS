import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto)
  }
  
  async getTaskById(id: string): Promise<Task> {
    const taskFounded = await this.tasksRepository.findOne(id);

    if (!taskFounded)
      throw new NotFoundException(`Task with ID ${id} not found`);

    return taskFounded;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const newTask = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.tasksRepository.save(newTask);
    return newTask;
  }

  // ? Otra manera de crear una Task, haciendo la logica dentro del Task Repository
  // createTask(createTaskDto: CreateTaskDto): Promise<Task> {
  //   return this.tasksRepository.createTask(createTaskDto);
  // }

  async updateTaskStatus(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const { status } = updateTaskDto;

    const task = await this.getTaskById(id);
    task.status = status;
    await this.tasksRepository.save(task);

    // const task = await this.tasksRepository.update(id, { status }) //? Otra manera de hacer el UPDATE

    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    const taskDeleted = await this.tasksRepository.delete(id);

    if (taskDeleted.affected === 0)
      throw new NotFoundException(`Task with ID ${id} not found`);
  }
}
