import { CommonEntity } from "src/common/entities/common.entity";
import { GroupPermission } from "src/group_permission/entities/group_permission.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Group extends CommonEntity {

	@Column({
		nullable: true
	})
	name: string;

	@OneToMany(() => GroupPermission, groupPermission => groupPermission.group)
	groupPermissions: GroupPermission[];

	@OneToMany(() => User, user => user.group)
	users: User[];
}
