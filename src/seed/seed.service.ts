import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) { }

  async runSeed() {
    return await this.insertNewProducts()
  }

  private async insertNewProducts() {
    // 1. Elimina todos los productos existentes antes de insertar los nuevos
    await this.productsService.deleteAllProducts()

    const seedProducts = initialData.products

    //* Tipamos como Promise<any>[] para evitar que TypeScript infiera el arreglo vacío como tipo 'never[]',
    //* lo cual causaba el error de que no se podía hacer .push() de una Promise.
    const insertPromises: Promise<any>[] = []

    // 2. Iteramos cada producto y agregamos la promesa de creación al arreglo sin esperar una por una
    seedProducts.forEach(product => {
      insertPromises.push(this.productsService.create(product))
    });

    // 3. Ejecutamos todas las promesas de inserción de forma simultánea / en paralelo
    await Promise.all(insertPromises)
    return true
  }
}
