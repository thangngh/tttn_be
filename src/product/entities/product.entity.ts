import { Cart } from "src/cart/entities/cart.entity";
import { Category } from "src/category/entities/category.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { Discount } from "src/discount/entities/discount.entity";
import { Order } from "src/order/entities/order.entity";
import { ProductInventory } from "src/product_inventory/entities/product_inventory.entity";
import { Review } from "src/review/entities/review.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Product extends CommonEntity {

	@Column({
		nullable: true
	})
	name: string

	@Column({
		name: 'desc',
		nullable: true
	})
	description: string

	@Column({
		name: 'category_id',
		nullable: true
	})
	categoryId: number;

	@Column({
		name: 'discount_id',
		nullable: true
	})
	discountId: number;

	@Column({
		type: 'boolean',
		name: 'is_active',
		nullable: true,
		default: true
	})
	isActive: boolean

	@ManyToOne(() => Discount, discount => discount.product)
	@JoinColumn({ name: 'discount_id' })
	discount: Discount

	@OneToMany(() => ProductInventory, productInventory => productInventory.product)
	productInventory: ProductInventory[]

	@ManyToOne(() => Category, category => category.product)
	@JoinColumn({ name: 'category_id' })
	category: Category

	@OneToMany(() => Cart, cart => cart.product)
	cart: Cart[]

	@OneToMany(() => Review, review => review.product)
	review: Review[]

	// @OneToMany(() => Order, order => order.product)
	// order: Order[]

	constructor(partial: Partial<Product>) {
		super();
		Object.assign(this, partial);
	}
}
