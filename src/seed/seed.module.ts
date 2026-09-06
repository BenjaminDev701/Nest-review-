import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  //*Importamos el modulo de productos porque si no , no tenemos acceso al productsService
  imports: [ProductsModule]
})
export class SeedModule { }
