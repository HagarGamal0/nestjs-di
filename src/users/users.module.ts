import { Injectable, Module } from '@nestjs/common';
import { UsersController } from './usersController';
import { UserService } from './users.service';
import { APP_NAME, USER_HABITS } from './user.constants';

class MockUserService {
  findUsers() {
    return ['user1', 'user2'];
  }
}
abstract class ConfigService {}
class DevelopmentConfigService extends ConfigService {}
class ProductionConfigService extends ConfigService {}

@Injectable()
class UserHabitsFactory {
  getHabits() {
    return ['eat', 'sleep', 'code'];
  }
}

@Module({
  controllers: [UsersController],
  providers: [
    // Standard provider
    UserService,
    UserHabitsFactory,
    // Custom provider
    // value based provider
    {
      provide: APP_NAME,
      useValue: 'Nest Demo API',
    },
    // class based provider
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },

    // factory based provider
    {
      provide: USER_HABITS,
      useFactory: (userHabits: UserHabitsFactory) => userHabits.getHabits(),
      inject: [UserHabitsFactory],
    },
  ],
})
export class UsersModule {}
