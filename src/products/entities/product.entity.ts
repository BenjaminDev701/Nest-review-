
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn, BeforeUpdate, OneToMany } from "typeorm";
import { ProductImage } from "./product-images.entity";

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

    @Column("text", { array: true, default: [] })
    sizes: string[]

    @Column("text")
    gender: string

    @Column("text", { array: true, default: [] })
    tags: string[]

    @OneToMany(
        //*Entidad con la que se relaciona 
        () => ProductImage,
        //* aqui hace que la entidad productImage apunte hacia productImage.producto que es el campo con el que se esta relacionando
        (productImage) => productImage.product,
        //* cascade hace que cuando se elimine el producto se eliminen las imagenes asociadas al producto
        //* eager para que traiga las iamgenes automaticamente en el find* 
        { cascade: true, eager: true }
    )
    //*Conectamos este campo a la tabla de ProductImage
    images?: ProductImage[]

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

    @BeforeUpdate()
    checkSlugUpdate() {
        if (!this.slug) {
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(" ", "_")
            .replaceAll("'", "")
    }
}










