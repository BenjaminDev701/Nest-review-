import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from "uuid"

@Injectable()
export class ProductsService {

  //*ProductsService es como la bandera de los logs y el logger es como el log de nest que hace que sea mas facil de observar
  private readonly logger = new Logger("ProductsService")
  //*Inyeccion de dependencias
  constructor(
    //*utiliza la dependeica que guardamos en forFeature
    @InjectRepository(Product)
    //*Tipo de dato para que vea la entidad
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product)
      console.log(product);
      return product
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const allProducts = await this.productRepository.find({
      take: limit,
      skip: offset,
      //Todo: relaciones
    })
    return allProducts;
  }

  async findOne(term: string) {
    let product: Product | null

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      //*el createQueryBuilder() nos ayuda a hacer consulta complejas con la bd usando SQL
      const queryBuilder = this.productRepository.createQueryBuilder()
      //*:title ,:slug son variables temporales las cuales les asignamos el valor de term a esas variables
      //*UPPER() TOMA EL VALOR DE LA COLUMNA Y LO PASA A MAYUSCULAS Y LA VARIBALE TEMPORAL LA PASAMOS A MAYUSCULAS ENTONCES EN LA COMPARACION RESULTA SER IGUAL
      product = await queryBuilder.where(`UPPER(title) =:title or slug=:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
        //*getOne() se usa para que si encuntra el title o el slug al mismo tiempo solo devuelva una consulta
      }).getOne()
    }
    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`)
    }
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      //*lo busca por id
      id: id,
      //*carga todos los datos del objeto con ..., y esto se extiende del update haciendo que todos los campos sean opcionales y los que no rellena se vuelven a colocar lo que se tenia antes
      ...updateProductDto
    })
    if (!product) throw new NotFoundException(`Product with ${id} not found`)

    try {
      await this.productRepository.save(product);

      return product
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async remove(id: string) {
    //*reutilizamos la logica del findOne para la busqueda de el producto,  y ya si no existe me mandara el error 404
    const product = await this.findOne(id)
    //*despues de que lo busque aqui lo removera de la bd al id que ocupe product
    await this.productRepository.remove(product)
    return "Eliminado"
  }

  private handleExceptions(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException("Error inesperado, revisa la terminal")
  }
}
