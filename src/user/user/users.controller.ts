import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUser.dto';
import { updateUserDto } from './dto/updateUser.dto';
import { ResponseInterceptor } from 'src/common/response.interceptor';
@UseInterceptors(new ResponseInterceptor())
@Controller('user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    try {
      const data = await this.usersService.findAll();
      console.log('data user : ', data);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(@Body() data: createUserDto) {
    try {
      const emailCheck = await this.usersService.checkEmail(data?.email);
      if (emailCheck) {
        throw new BadRequestException('Email already exists');
      }

      const user = await this.usersService.create(data);
      return {
        message: 'Success',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.usersService.findOne(id);

    if (!data) {
      throw new NotFoundException('Data not found!');
    }

    return {
      message: 'Success',
      data: data,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: updateUserDto) {
    try {
      const cek = await this.usersService.findOne(id);
      if (!cek) {
        throw new NotFoundException('Data not found');
      }

      const emailCheck = await this.usersService.checkEmailForUpdate(
        data?.email,
        id,
      );
      if (emailCheck) {
        throw new BadRequestException('Email already exists');
      }

      await this.usersService.update(id, data);
      return {
        message: 'Update success',
        data: data,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async destroy(@Param('id') id: number) {
    try {
      const cek = await this.usersService.findOne(id);
      if (!cek) {
        throw new NotFoundException('Data not found');
      }

      const result = await this.usersService.remove(id);

      return {
        message: 'Data has been delete',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
