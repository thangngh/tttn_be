import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'user_id'
	})
	userId: number;

	@Column({
		name: 'content',
		nullable: true
	})
	content: string;

	@Column({
		name: 'created_at',
		default: () => 'CURRENT_TIMESTAMP'
	})
	createdAt: Date;

	@ManyToOne(() => User, user => user.notification)
	@JoinColumn({ name: 'user_id' })
	user: User
}
