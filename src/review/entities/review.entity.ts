import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IComment } from "../interface/review.interface";
import { User } from "src/user/entities/user.entity";
import { Product } from "src/product/entities/product.entity";

@Entity()
export class Review extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number

	@Column({
		name: "user_id"
	})
	userId: number;

	@Column({
		name: "product_id"
	})
	productId: number;

	@Column({
		name: "rating"
	})
	rating: number;

	@Column({
		name: "comment",
		type: 'jsonb',
	})
	comment: IComment;

	@Column({
		name: "created_at"
	})
	createdAt: Date;

	@Column({
		name: "updated_at",

		nullable: true
	})
	updatedAt: Date;

	@Column({
		name: "deleted_at",
		nullable: true
	})
	deletedAt: Date;

	@Column({
		name: "is_deleted",
		nullable: true,
		default: false
	})
	isDeleted: boolean;

	@ManyToOne((type) => User, user => user.review)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne((type) => Product, product => product.review)
	@JoinColumn({ name: 'product_id' })
	product: Product;


	constructor(partial: Partial<Review>) {
		super();
		Object.assign(this, partial);
	}

}
