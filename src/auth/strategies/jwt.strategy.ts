import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPaylaod } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


//*hace que esto lo podamos enlazar con otro modulo
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get("SECRET_WORD") as string,
            //*le dice a passport que el token va a venir en el header como Bearer Token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: JwtPaylaod): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id })
        if (!user) throw new UnauthorizedException("Token no valid")

        if (!user.isActive) throw new UnauthorizedException("is not active")

        return user;
    }

}