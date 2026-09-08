import { IsArray, IsBoolean, IsEmail, IsString, Min, MinLength } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity("users")
export class User {

    @PrimaryColumn("uuid")
    id: string

    @Column("text", { unique: true })
    @IsEmail()
    email: string

    @Column("text")
    @IsString()
    @MinLength(8)
    password: string

    @Column("text")
    @IsString()
    fullName: string

    @Column("bool")
    @IsBoolean()
    isActive: boolean

    @Column("text", { array: true, default: ["user"] })
    @IsArray()
    roles: string[]
}
