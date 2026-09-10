import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({

  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),

    /* 
    Configuración de passport para el manejo de autenticación 
    */
    PassportModule.register({ defaultStrategy: "jwt" }),

    /* 
    Configuración del módulo JWT 
    */
    JwtModule.registerAsync({
      //*permite inyectar el config service para acceder a las variables de entorno
      imports: [ConfigModule],
      //*inyecta el config service para acceder a las variables de entorno
      inject: [ConfigService],
      //*useFactory se usa para configuraciones asincronas haciendo que se ejecute primero antes de iniciar la aplicacion.
      useFactory: (configService: ConfigService) => {
        return {
          //*la palabra secreta del JWT
          secret: configService.get("SECRET_WORD"),
          signOptions: {
            //*tiempo de expiracion del token
            expiresIn: "2h"
          }
        }
      }
    })
  ],
  exports: [TypeOrmModule, JWTStrategy, PassportModule, JwtModule]
})
export class AuthModule { }
