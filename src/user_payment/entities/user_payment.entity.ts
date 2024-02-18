import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserPayment extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'payment_type',
		nullable: true
	})
	paymentType: string

	@Column({
		nullable: true
	})
	provider: string;

	@Column({
		name: 'account_no'
	})
	accountNo: number;

	@Column()
	expiry: Date;

	@Column({
		name: 'user_id'
	})
	userId: number;

	@ManyToOne(() => User, user => user.userPayments)
	@JoinColumn({ name: "user_id" })
	user: User
}
