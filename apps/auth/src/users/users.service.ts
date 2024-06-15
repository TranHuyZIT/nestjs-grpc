import { Injectable, Controller } from '@nestjs/common';

import {
  CreateUserDto,
  FindOneUserDto,
  PaginationDto,
  UpdateUserDto,
  User,
  UserList,
  UserServiceController,
} from '@app/common';
import { NotFoundError, Observable, Subject } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
@Controller()
export class UsersService {
  private readonly users: User[] = [];

  onModuleInit() {
    for (let i = 0; i <= 50; i++) {
      this.createUser({
        username: randomUUID(),
        age: i + 10,
        email: `${randomUUID()}@gmail.com`,
        role: 'user',
      });
    }
  }
  createUser(createUserDto: CreateUserDto): User {
    const user = {
      id: randomUUID(),
      ...createUserDto,
      subscribed: false,
      socialMedia: undefined,
    };
    this.users.push(user);
    return user;
  }

  findAllUsers(): UserList {
    return { users: this.users };
  }

  findOneUser(dto: FindOneUserDto): User {
    return this.users.find((user) => user.id === dto.id);
  }

  updateUser(updateUserDto: UpdateUserDto): User {
    const user = this.users.find((user) => user.id === updateUserDto.id);
    if (user) {
      user.socialMedia = updateUserDto.socialMedia;
      return user;
    }
    throw new Error('User not found');
  }

  removeUser(dto: FindOneUserDto): User {
    const user = this.users.find((user) => user.id === dto.id);
    if (user) {
      this.users.splice(this.users.indexOf(user), 1);
    }
    return user;
  }

  queryUsers(
    paginationStream: Observable<PaginationDto>,
  ): Observable<UserList> {
    const subject = new Subject<UserList>();

    const onNext = (pagination: PaginationDto) => {
      const users = this.users.slice(pagination.skip, pagination.page);
      subject.next({ users });
    };

    const onComplete = () => {
      subject.complete();
    };

    paginationStream.subscribe({
      next: onNext,
      complete: onComplete,
    });
    return subject.asObservable();
  }
}
