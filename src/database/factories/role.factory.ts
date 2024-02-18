import { Role } from 'src/roles/entities/role.entity';
import { setSeederFactory } from 'typeorm-extension';
export default setSeederFactory(Role, async (faker) => {
  const role = new Role();
  return role;
});
