import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { TaskStatus } from './task-status-enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });
  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');
    // query.andWhere('task.user.id = :userId', { userId: user.id }) // ? mi manera de hacerlo
    query.where({ user });

    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    // ? revisar los filtros xq predomina el search por encima de status y no se cruzan(solucionado por el profesor clase 75)

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      // log
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)} `,
        error.stack
      );
      throw new InternalServerErrorException();
    }
  }

  // async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
  //   const { title, description } = createTaskDto;
  //   const newTask = this.create({
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   });
  //   await this.save(newTask);
  //   return newTask;
  // }
}
