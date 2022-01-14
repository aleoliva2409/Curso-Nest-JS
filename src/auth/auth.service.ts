import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    return this.userRepository.createUser(authCredentials);
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentials;

    const user = await this.userRepository.findOne({ username });
    const validatePassword = await compare(password, user.password);

    if (user && validatePassword) return 'success'; // ? en caso de queres negarlos , el PASSWORD debe ir primero, ya que si el usuario existe directamente se salta la condicion

    throw new UnauthorizedException('Please check your username or password');
  }
}
