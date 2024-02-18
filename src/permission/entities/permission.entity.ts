import { CommonEntity } from "src/common/entities/common.entity";
import { GroupPermission } from "src/group_permission/entities/group_permission.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Permission extends CommonEntity {

	@Column({
		nullable: true
	})
	subject: string

	@Column({
		nullable: true
	})
	action: string

	@Column({
		nullable: true,
		type: 'jsonb'
	})
	condition: any

	@OneToMany(() => GroupPermission, groupPermission => groupPermission.permission)
	groupPermissions: GroupPermission[];
}
