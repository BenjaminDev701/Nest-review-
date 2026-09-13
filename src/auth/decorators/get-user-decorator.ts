import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

//*createParamDecorator sirve com fabrica para crear decoradores personalizados
export const GetUser = createParamDecorator(
    //*ExecutionContext es la interface de nest que representa la ejecucion 
    //*data es el valor que se le pasa al decorador en auth.controller
    //*ctx: ExecutionContext:El contexto global de la petición que NestJS tiene en memoria en ese instante.
    (data: string, ctx: ExecutionContext) => {
        //*switchToHttp:obtiene los metodos http , y el getRequest obtiene la peticion http
        const req = ctx.switchToHttp().getRequest()
        //*sacamos el usuario que viene del Guard de auth.service
        const user = req.user
        if (!user) throw new InternalServerErrorException("User not found")
        // return user
        return (!data) ? user : user[data]


    })