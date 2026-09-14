import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get("roles", ctx.getHandler())
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
