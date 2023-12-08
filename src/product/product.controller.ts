import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/utils/productUpload.utils';
import { createProductDTO } from './dto/createProduct.dto';
import { ProductInterceptor } from 'src/common/product.interceptor';
import * as fs from 'fs';

@UseInterceptors(new ProductInterceptor())
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async findAll() {
    try {
      const result = await this.productService.findAll();
      return {
        message: 'Success',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async create(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() data: createProductDTO,
  ) {
    try {
      const { filename } = file;
      data.productImage = filename;
      const result = await this.productService.create(data);

      return {
        message: 'Product has been created',
        data: result,
      };
    } catch (error) {
      if (file) {
        const pathImage = `./public/uploads/${file.filename}`;
        if (fs.existsSync(pathImage)) {
          fs.unlinkSync(pathImage);
        }
      }
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    try {
      const chek = await this.productService.findById(id);
      if (!chek) {
        throw new NotFoundException();
      }

      return {
        message: 'Success',
        data: chek,
      };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'public/uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Param('id') id: number,
    @Body() data: createProductDTO,
  ) {
    try {
      const check = await this.productService.findById(id);
      if (!check) {
        throw new NotFoundException('Data not found');
      }

      if (file) {
        data.productImage = file?.filename;

        const pathImage = `./public/uploads/${check.productImage}`;
        if (pathImage) {
          fs.unlinkSync(pathImage);
        }
      } else {
        data.productImage = check?.productImage;
      }

      const result = await this.productService.updateProduct(id, data);

      return {
        message: 'Product has been updated',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async destroy(@Param('id') id: number) {
    try {
      const check = await this.productService.findById(id);
      if (!check) {
        throw new NotFoundException('Data not found');
      }

      await this.productService.remove(id);
      const pathImage = `./public/uploads/${check.productImage}`;
      if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
      }
      return {
        message: 'Product has been deleted!',
        data: null,
      };
    } catch (error) {
      throw error;
    }
  }
}
