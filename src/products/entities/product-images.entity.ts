import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number

    @Column("text")
    url: string

    @ManyToOne(() => Product,
        (product) => product.images,
        //*onDelete nos ayuda a que cuando se elimine el producto se eliminen todas las imagenes asociadas al producto 
        { onDelete: "CASCADE" }
    )
    product: Product

    //Todo: la columna productId se creo gracias a la relacion ManyToOne que hay entre tablas


}