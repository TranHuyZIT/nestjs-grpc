import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  FindOneUserDto,
  PaginationDto,
  UpdateUserDto,
  UserList,
  UserServiceController,
  UserServiceControllerMethods,
} from '@app/common';
import { Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}
  createUser(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  findOneUser(@Payload() dto: FindOneUserDto) {
    return this.usersService.findOneUser(dto);
  }

  updateUser(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }

  removeUser(@Payload() dto: FindOneUserDto) {
    return this.usersService.removeUser(dto);
  }

  queryUsers(request: Observable<PaginationDto>) {
    return this.usersService.queryUsers(request);
  }
}
