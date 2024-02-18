import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
import { ProductInventory } from "src/product_inventory/entities/product_inventory.entity";
import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'product_id'
	})
	productId: number;

	@Column({
		name: 'product_inventory_id'
	})
	productInventoryId: number;

	@Column({
		name: 'user_id'
	})
	userId: number;

	@Column({
		nullable: true,
	})
	total: number;

	@Column({
		nullable: true,
		type: 'float'
	})
	price: number

	@Column({
		name: 'is_active',
		default: true
	})
	isActive: boolean

	@ManyToOne(() => Product, product => product.cart)
	@JoinColumn({ name: 'product_id' })
	product: Product

	@ManyToOne(() => ProductInventory, productInventory => productInventory.cart)
	@JoinColumn({ name: 'product_inventory_id' })
	productInventory: ProductInventory

	@ManyToOne(() => User, user => user.cart)
	@JoinColumn({ name: 'user_id' })
	user: Product

	@OneToMany(() => Order, order => order.cart)
	order: Order[]

	constructor(partial: Partial<Cart>) {
		super();
		Object.assign(this, partial);
	}
}
