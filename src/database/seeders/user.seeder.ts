import { ProviderType, enumRole } from 'src/auth/interface/auth.interface';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    const data = {
      username: 'admin',
      password: '$2b$10$uTSddmy1TDEPH7kSKHJmg.56JCJgM3Y2EIpptwRiBmnDPehQcG7fu',
      firstName: 'admin',
      lastName: 'boss',
      phone: '099999999',
      email: 'admin@gmail.com',
      roleId: enumRole.ADMIN,
      providerType: ProviderType.USERNAME
    };
    const findUser = await repository.findOneBy({
      username: data.username,
    });
    if (!findUser) {
      await repository.insert([
        {
          username: data.username,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          roleId: data.roleId,
          isActive: true,
          providerType: data.providerType
        },
      ]);
    }
  }
}
