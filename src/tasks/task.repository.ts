import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { TaskStatus } from './task-status-enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    // TODO: revisar los filtros xq predomina el search por encima de status y no se cruzan
    const tasks = await query.getMany();
    return tasks;
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
