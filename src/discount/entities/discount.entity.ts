import { CommonEntity } from "src/common/entities/common.entity";
import { Product } from "src/product/entities/product.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Discount extends CommonEntity {

	@Column({
		nullable: true
	})
	name: string;

	@Column({
		name: 'desc',
		nullable: true
	})
	description: string;

	@Column({
		name: 'discount_percent',
		nullable: true
	})
	discountPercent: string;

	@Column({
		name: 'is_active',
		type: 'boolean',
		default: false
	})
	isActive: boolean;

	@OneToMany(() => Product, product => product.discount)
	product: Product[]

}
