import { IAddress } from "src/auth/interface/auth.interface";
import { Category } from "src/category/entities/category.entity";
import { PageVisit } from "src/page-visit/entites/page-visit.entity";
import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shop extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

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
		name: 'address',
		type: 'jsonb',
		nullable: true
	})
	address: IAddress

	@Column({ nullable: true })
	phone: string

	@Column({ name: 'is_active', type: 'boolean', nullable: true })
	isActive: boolean

	@Column({
		name: 'user_id'
	})
	userId: number

	@OneToOne(() => User, user => user.shop)
	@JoinColumn({ name: 'user_id' })
	user: User

	@OneToMany(() => Category, category => category.shop)
	category: Category[]

	@OneToMany(() => PageVisit, pageVisit => pageVisit.shop)
	pageVisit: PageVisit[]

	constructor(partial: Partial<Shop>) {
		super()
		Object.assign(this, partial)
	}
}
