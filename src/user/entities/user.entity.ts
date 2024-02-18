import { Cart } from "src/cart/entities/cart.entity";
import { Role } from "src/roles/entities/role.entity";
import { Shop } from "src/shop/entities/shop.entity";
import { UserAddress } from "src/user_address/entities/user_address.entity";
import { UserPayment } from "src/user_payment/entities/user_payment.entity";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { IAddress, ProviderType } from "src/auth/interface/auth.interface";
import { Group } from "src/group/entities/group.entity";
import { Review } from "src/review/entities/review.entity";
import { Message } from "src/message/entities/message.entity";
import { Order } from "src/order/entities/order.entity";
import { Notification } from "src/notification/entities/notification.entity";
@Entity()
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column()
	email: string

	@Column({ nullable: true })
	phone: string;

	@Column({ nullable: true })
	avatar: string;

	@Column({ nullable: true })
	gender: string

	@Column()
	isActive: boolean;

	@Column({
		type: 'enum',
		enum: ProviderType,
		default: ProviderType.USERNAME,
	})
	providerType: ProviderType;

	@Column({
		name: 'role_id',
		nullable: false
	})
	roleId: number;

	@Column({
		name: 'group_id',
		nullable: true
	})
	groupId: number

	@Column({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createAt: Date;

	@OneToMany(() => UserPayment, userPayment => userPayment.user)
	userPayments: UserPayment[]

	@OneToMany(() => UserAddress, userAddress => userAddress.user)
	userAddresses: UserAddress[]

	@OneToMany(() => Review, review => review.user)
	review: Review[]

	@OneToMany(() => Cart, cart => cart.user)
	cart: Cart[]

	@OneToMany(() => Message, cart => cart.from)
	message: Message[]

	@OneToMany(() => Message, cart => cart.to)
	tMessage: Message[]

	@OneToOne(() => Shop, shop => shop.user)
	shop: Shop

	@OneToMany(() => Order, order => order.user)
	order: Order[]

	@OneToMany(() => Notification, notification => notification.user)
	notification: Notification[]

	@ManyToOne(() => Role, role => role.users)
	@JoinColumn({ name: 'role_id' })
	role: Role

	@ManyToOne(() => Group, group => group.users)
	@JoinColumn({ name: 'group_id' })
	group: Group

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		const salt = await bcrypt.genSalt();
		this.password = await bcrypt.hash(this.password, salt);
	}

	async validatePassword(password: string): Promise<boolean> {
		const isMatch = await bcrypt.compare(password, this.password);
		return isMatch;
	}

	constructor(partial?: Partial<User>) {
		super();
		Object.assign(this, partial);
	}

}
