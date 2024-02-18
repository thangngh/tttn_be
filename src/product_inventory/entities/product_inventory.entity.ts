import { Cart } from "src/cart/entities/cart.entity";
import { CommonEntity } from "src/common/entities/common.entity";
import { Product } from "src/product/entities/product.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProductInventory extends CommonEntity {

	@Column({
		nullable: true
	})
	image: string;

	@Column({
		nullable: true
	})
	quantity: number;

	@Column({
		nullable: true,
		type: 'character varying'
	})
	price: string;

	@Column({
		nullable: true,
		name: 'product_id'
	})
	productId: number;

	@ManyToOne(() => Product, product => product.productInventory)
	@JoinColumn({ name: 'product_id' })
	product: Product

	@OneToOne(() => Cart, cart => cart.productInventory)
	cart: Cart[]

	constructor(partial: Partial<ProductInventory>) {
		super();
		Object.assign(this, partial);
	}
}
