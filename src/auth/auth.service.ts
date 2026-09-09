import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from "./dto/create-user.dto"
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { LoginUserDto } from './dto/login-user.dto';


@Injectable()
export class AuthService {

  constructor(@InjectRepository(User)
  private readonly userRepository: Repository<User>) { }

  async create(createuserDto: CreateUserDto) {
    const { password, ...userData } = createuserDto
    try {
      const user = this.userRepository.create({
        password: bcrypt.hashSync(password, 10),
        ...userData
      })
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDbErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email }, select: { email: true, password: true } })

    if (!user) throw new UnauthorizedException("Credentials no valid!")

    if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException("Credentials no valid!")

    return user
    //*TODO: JWT
  }

  private handleDbErrors(error: any): never {
    if (error.code === "23505")
      throw new BadRequestException(error.detail);
    console.log(error);

    throw new InternalServerErrorException("Please check your terminal")
  }
}
