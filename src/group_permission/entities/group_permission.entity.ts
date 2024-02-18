import { CommonEntity } from "src/common/entities/common.entity";
import { Group } from "src/group/entities/group.entity";
import { Permission } from "src/permission/entities/permission.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class GroupPermission extends CommonEntity {

	@Column({
		name: 'permission_id',
		nullable: true
	})
	permissionId: number;

	@Column({
		name: 'group_id',
		nullable: true
	})
	groupId: number;

	@ManyToOne(() => Permission, permission => permission.groupPermissions)
	@JoinColumn({ name: 'permission_id' })
	permission: Permission;

	@ManyToOne(() => Group, group => group.groupPermissions)
	@JoinColumn({ name: 'group_id' })
	group: Group;
}
