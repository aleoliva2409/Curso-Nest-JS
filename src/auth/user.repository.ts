import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { genSalt, hash } from 'bcrypt'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials;

    const salt = await genSalt()
    const hashedPassword = await hash(password, salt)

    const newUser = this.create({
      username,
      password: hashedPassword
    });

    try {
      await this.save(newUser);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException()
    }
  }
}
