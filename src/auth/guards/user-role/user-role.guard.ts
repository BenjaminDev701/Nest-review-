import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  //*reflector nos permite lector de metadatos de los decoradores que estan en auth
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get("roles", ctx.getHandler())

    //*si la ruta no tiene un metadato de roles, se le permite el acceso
    if (!validRoles) return true
    //*si el metadato es un array vacio, se le permite el acceso
    if (validRoles.length === 0) return true
    const req = ctx.switchToHttp().getRequest()
    const user = req.user;

    if (!user) throw new BadRequestException("not found the user")

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true
      }
    }


    throw new ForbiddenException(`user ${user.fullName} need a valid role`)
  }
}
