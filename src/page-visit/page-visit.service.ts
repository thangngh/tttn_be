import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageVisit } from './entites/page-visit.entity';
import { Repository } from 'typeorm';
import { CreatePageVisitDto } from './dto/create-page.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PageVisitService {

	constructor(
		@InjectRepository(PageVisit)
		private readonly pageVisitRepository: Repository<PageVisit>,
	) { }

	async create(pageVisit: CreatePageVisitDto) {
		return await this.pageVisitRepository.save({
			...pageVisit,
			createAt: new Date()
		});
	}

	async getTotalVisitInShop(user: User) {
		return await this.pageVisitRepository.createQueryBuilder('pageVisit')
			.leftJoinAndSelect("pageVisit.shop", "shop")
			.leftJoinAndSelect("shop.user", "user")
			.select('COUNT(*)', 'total')
			.where('user.id = :shopId', { shopId: user.id })
			.getRawOne();
	}


}
