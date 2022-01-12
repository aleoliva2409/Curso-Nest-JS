import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search))
          return true;
        return false;
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) throw new NotFoundException();

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: v4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, updateTaskDto: UpdateTaskDto): Task {

    const { status } = updateTaskDto

    const task = this.getTaskById(id);
    // const tasksFiltered = this.tasks.filter(task => task.id !== id)
    // this.tasks = [{...task, status}, ...tasksFiltered]
    // ? El codigo comentado da vueltas, Find obtiene el objeto de un array pero te lo pasa por referencia y si editas dicho objeto se editara el que esta dentro del array como se ve en el ejemplo de abajo
    task.status = status;
    return task;
  }

  deleteTaskById(id: string): Task {
    const taskDeleted = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== taskDeleted.id);

    return taskDeleted;
  }
}
