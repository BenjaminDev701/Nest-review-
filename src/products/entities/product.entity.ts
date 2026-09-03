import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//*La entidad es como la tabla de la bd 
@Entity()
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("text", { unique: true })
    title: string

    //*si no le coloco precio saldra como 0
    @Column("numeric", { default: 0 })
    price: number

    //*Puede ser nulo es decir que no siempre puede tener un valor y saldra en blanco
    @Column("text", { nullable: true })
    description: string

    @Column("text", { unique: true })
    slug: string

    @Column("int", { default: 0 })
    stock: number

    @Column("text", { array: true })
    sizes: string[]

    @Column("text")
    gender: string

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title

        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
    }
}










