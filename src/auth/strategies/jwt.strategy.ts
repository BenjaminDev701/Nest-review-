import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPaylaod } from "../interfaces/jwt-payload.interface";

export class JWTStrategy extends PassportStrategy(Strategy) {


    async validate(payload: JwtPaylaod): Promise<User> {

        const { email } = payload;

        return;
    }

}