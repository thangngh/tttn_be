import { Shop } from "src/shop/entities/shop.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PageVisit extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'shop_id'
	})
	shopId: number;

	@Column()
	ip: string;

	@ManyToOne(() => Shop, shop => shop.pageVisit)
	@JoinColumn({ name: 'shop_id' })
	shop: Shop

	@Column({
		name: 'create_at',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createAt: Date;
}