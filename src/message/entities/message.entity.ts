import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		name: 'room_id'
	})
	roomId: string;

	@Column({
		name: 'from_id'
	})
	fromId: string;

	@Column({
		name: 'to_id'
	})
	toId: string;

	@Column({
		name: 'content'
	})
	content: string;

	@Column({
		name: 'created_at'
	})
	createdAt: Date;

	@ManyToOne(() => User, fUser => fUser.message)
	@JoinColumn({ name: 'from_id' })
	from: User;

	@ManyToOne(() => User, tUser => tUser.tMessage)
	@JoinColumn({ name: 'to_id' })
	to: User;

	constructor(partial: Partial<Message>) {
		super();
		Object.assign(this, partial);
	}
}
