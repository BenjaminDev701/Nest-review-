import { IsArray, IsBoolean, IsEmail, IsString, Min, MinLength } from "class-validator";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("text", { unique: true })
    @IsEmail()
    email: string

    //*selecionamos para que no salga la contraseña
    @Column("text", { select: false })
    @IsString()
    @MinLength(8)
    password: string

    @Column("text")
    @IsString()
    fullName: string

    @Column("bool", {
        default: true
    })
    @IsBoolean()
    isActive: boolean

    @Column("text", { array: true, default: ["user"] })
    @IsArray()
    roles: string[]

    @BeforeInsert()
    checkEmail() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkUpdate() {
        this.checkEmail()
    }
}
