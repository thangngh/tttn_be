import { Role } from 'src/roles/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(Role);

    const data = [
      {
        name: 'USER',
      },
      {
        name: 'ADMIN',
      },
      {
        name: 'SHOPPER',
      },
    ];
    for await (const item of data) {
      const findRole = await repository.findOneBy({
        name: item.name,
      });
      if (!findRole) {
        await repository.insert([{ name: item.name }]);
      }
    }
  }
}
