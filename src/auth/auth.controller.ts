import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user-decorator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/get-rawHeaders-decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


  @Get("private")
  @UseGuards(AuthGuard())
  //*metodo del controlador que se ejecuta si el cliente paso el filtro de AuthGuard
  testingPrivateRoute(
    @Req() req: Express.Request,
    //*extrae todo el objeto completo
    @GetUser() user: User,
    //*extrae solo el email
    @GetUser("email") userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {


    return {
      ok: true,
      user,
      userEmail,
      rawHeaders
    }
  }


  @Get("private2")
  @UseGuards(AuthGuard(), UserRoleGuard)
  @SetMetadata("roles", ["admin", "super-user",])
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }
}
