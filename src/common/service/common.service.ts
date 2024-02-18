import { Injectable } from "@nestjs/common";

//base crud with generic repository
@Injectable()
export class BaseService<T> {
	constructor(private repository) { }

	async findAll() {
		const result = await this.repository.find();
		return result;
	}

	async findOne(id: number) {
		const result = await this.repository.findOne(id);
		return result;
	}

	async create(body: T) {
		const result = await this.repository.save(body);
		return result;
	}

	async update(id: number, body: T) {
		const result = await this.repository.update(id, body);
		return result;
	}

	async delete(id: number) {
		const result = await this.repository.delete(id);
		return result;
	}
}