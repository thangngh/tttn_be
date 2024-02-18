import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';
import {
  roleFactory,
  userFactory,
} from '../factories';
import RoleSeeder from './role.seeder';
import UserSeeder from './user.seeder';

export default class InitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [
        RoleSeeder,
        UserSeeder,
      ],
      factories: [
        roleFactory,
        userFactory,
      ],
    });
  }
}
