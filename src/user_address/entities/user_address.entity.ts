import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
@Entity()
export class UserAddress extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		nullable: true
	})
	city: string;

	@Column({
		nullable: true
	})
	district: string;

	@Column({
		nullable: true
	})
	street: string;

	@Column({
		nullable: true,
	})
	country: string;

	@Column({
		nullable: true
	})
	telephone: string;

	@Column({
		name: 'is_default',
		type: 'boolean',
		default: false
	})
	isDefault: boolean

	@Column({
		name: 'user_id',
		nullable: true
	})
	userId: number;

	@ManyToOne(() => User, user => user.userAddresses)
	@JoinColumn({ name: "user_id" })
	user: User;

	@OneToMany(() => Order, order => order.userAddress)
	order: Order[];
}
