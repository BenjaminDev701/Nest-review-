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


      product = await queryBuilder.where(`title =: title or slug=:slug`, {
        title: term,
        slug: term
      }).getOne()
    }
    //const product = await this.productRepository.findOneBy({})
    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`)
    }
    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
