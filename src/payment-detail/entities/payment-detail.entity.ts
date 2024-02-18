import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PaymentDetailEntity extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	amount: number;

	@Column()
	status: string;

	@Column({
		name: 'create_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createAt: Date;

}