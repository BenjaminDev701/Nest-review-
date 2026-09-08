import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';


//*carga de imagenes
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post("product")
  //*interceptor es como un middleware que toma algo antes de que pase al metodo del controlador
  //*fileinterceptor se encarga de procesar el archivo con el nombre clave "file"
  @UseInterceptors(FileInterceptor("file", {
    fileFilter: fileFilter
  }))
  uploadProductImage(
    //*@UploadedFile extrae el archivo ya procesado por el interceptor, y lo inyecta como un argumento "file"
    //*Express.Multer.File es el tipo de archivo que se espera
    @UploadedFile() file: Express.Multer.File
  ) {
    return {
      fileName: file.originalname
    }
  }
}
