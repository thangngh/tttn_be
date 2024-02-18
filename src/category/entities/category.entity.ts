import { CommonEntity } from "src/common/entities/common.entity";
import { Product } from "src/product/entities/product.entity";
import { Shop } from "src/shop/entities/shop.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category extends CommonEntity {

	@Column()
	name: string

	@Column({
		type: 'boolean',
		nullable: true,
		default: true,
		name: 'is_active'
	})
	isActive: boolean

	@Column({
		name: 'shop_id'
	})
	shopId: number;

	@OneToMany(() => Product, product => product.category)
	product: Product[]

	@ManyToOne(() => Shop, shop => shop.category)
	@JoinColumn({ name: 'shop_id' })
	shop: Shop


	constructor(partial: Partial<Category>) {
		super();
		Object.assign(this, partial);
	}

}
