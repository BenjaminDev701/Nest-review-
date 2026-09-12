import { createParamDecorator, ExecutionContext, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        console.log({ ctx });
        //*obtiene la peticion http
        const req = ctx.switchToHttp().getRequest()
        //*sacamos el usuario que viene del Guard de auth.service
        const user = req.user
        if (!user) throw new InternalServerErrorException("User not found")
        return user

    })