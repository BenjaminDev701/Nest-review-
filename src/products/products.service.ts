import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, DataSource } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from "uuid"
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  //*ProductsService es como la bandera de los logs y el logger es como el log de nest que hace que sea mas facil de observar
  private readonly logger = new Logger("ProductsService")
  //*Inyeccion de dependencias
  constructor(
    //*utiliza la dependeica que guardamos en forFeature
    @InjectRepository(Product)
    //*Tipo de dato para que vea la entidad
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    //*sirve para crear el queryRunner y de esta manera manejar las transacciones en caso de error
    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {

    const { images = [], ...productDetails } = createProductDto
    try {
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) => this.productImageRepository.create({ url: image }))
      })
      await this.productRepository.save(product)
      return { ...product, images: images }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })
    //*lo que entendi es qeue cuando retornemos el objeto iterara sobre cada prodcut en el cual pondra todo lo que es el prodcuto todas sus datos y aparte otra toma las iamgeenes y las mapea osea que las itera y hace que cada objeto sea solo la url no?
    return products.map((product) => ({
      ...product,
      images: product.images?.map(img => img.url)
    }));
  }

  async findOne(term: string) {
    let product: Product | null

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      //*el createQueryBuilder() nos ayuda a hacer consulta complejas con la bd usando SQL y prod es un alias para la tabla product , este alias lo usamos en leftjoinandselect
      const queryBuilder = this.productRepository.createQueryBuilder("prod")
      //*:title ,:slug son variables temporales las cuales les asignamos el valor de term a esas variables
      //*UPPER() TOMA EL VALOR DE LA COLUMNA Y LO PASA A MAYUSCULAS Y LA VARIBALE TEMPORAL LA PASAMOS A MAYUSCULAS ENTONCES EN LA COMPARACION RESULTA SER IGUAL
      product = await queryBuilder.where(`UPPER(title) =:title or slug=:slug`, {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
        //*getOne() se usa para que si encuntra el title o el slug al mismo tiempo solo devuelva una consulta
        //*leftJoinAndSelect extrae los datos de la bd y las almacena de momento para que las use despues
      }).leftJoinAndSelect("prod.images", "prodImages").getOne()
    }
    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`)
    }
    return product
  }
  //*metodo aplanador o adaptador
  async findOnePlain(term: string) {
    //*separamos las imagenes y el resto de datos
    const { images = [], ...product } = await this.findOne(term)
    return {
      ...product,

      images: images.map((image) => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate } = updateProductDto

    const product = await this.productRepository.preload({
      //*lo busca por id
      id: id,
      //*carga todos los datos del objeto con ..., y esto se extiende del update haciendo que todos los campos sean opcionales y los que no rellena se vuelven a colocar lo que se tenia antes
      ...toUpdate,
    })
    if (!product) throw new NotFoundException(`Product with ${id} not found`)

    //*Create QueryRunner: sirve para poder hacer transacciones osea que si falla algo se remuevan todos los cambios que se hicieron
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {                    //*La entidad que quiero afectar, {criterio}
        await queryRunner.manager.delete(ProductImage, { product: id })


        product.images = images?.map(image => this.productImageRepository.create({ url: image }))

      } else {

      }
      await queryRunner.manager.save(product)
      await queryRunner.commitTransaction()
      await queryRunner.release()
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
