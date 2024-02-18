import { Cart } from "src/cart/entities/cart.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { UserAddress } from "src/user_address/entities/user_address.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'cart_id'
	})
	cartId: number;

	@Column({
		name: 'user_id'
	})
	userId: number;

	@Column({
		name: 'user_address_id',
		nullable: true
	})
	userAddressId: number;

	@Column()
	status: string;

	@Column({
		name: 'create_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createAt: Date;

	@Column({
		name: 'update_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP'
	})
	updateAt: Date;

	@ManyToOne(() => User, user => user.order)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Cart, cart => cart.order)
	@JoinColumn({ name: 'cart_id' })
	cart: Cart;

	@ManyToOne(() => UserAddress, userAddress => userAddress.order)
	@JoinColumn({ name: 'user_address_id' })
	userAddress: UserAddress;
}
