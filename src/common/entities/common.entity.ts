import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CommonEntity extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'timestamp',
		name: 'create_at',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createAt: Date;

	@Column({
		name: 'modified_at',
		type: 'timestamp',
		nullable: true
	})
	modifiedAt: Date

	@Column({
		name: 'deleted_at',
		type: 'timestamp',
		nullable: true
	})
	deletedAt: Date
}