import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { enumRole } from 'src/auth/interface/auth.interface';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { PaginationDTO } from 'src/common/pagination/dto/paginationQuery-dto';
import { Pagination } from 'src/common/pagination';
import { addUserToGroupDto } from './dto/add-user-to-group.dto';
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly authService: AuthService
	) { }

	async findAll(query: PaginationDTO): Promise<Pagination<any>> {
		const DEFAULT_LIMIT = 10;
		const DEFAULT_PAGE = 1;

		const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE, search = '', role = '' } = query;

		const take = limit;
		const skip = (page - 1) * take;

		const userQueryBuilder = await this.userRepository.createQueryBuilder("user")
			.leftJoinAndSelect("user.role", "role")
			.where("role.id != :id", { id: enumRole.ADMIN })
			.andWhere("user.isActive = :isActive", { isActive: true })
			.orderBy("user.createAt", 'DESC')
		// .andWhere("user.firstname LIKE :search", { search: `%${search}%` })
		if (role) {
			userQueryBuilder.andWhere("role.name = :roleName", { roleName: role })
		}

		userQueryBuilder.take(take)
		userQueryBuilder.skip(skip)

		const results = await userQueryBuilder.getMany();
		const total = await userQueryBuilder.getCount()

		return new Pagination<any>({
			results: results,
			total,
		});
	}

	async findOne(user: User) {
		const userRepository = await this.userRepository.createQueryBuilder("user")
			.leftJoinAndSelect("user.role", "role")
			.where("user.id = :id", { id: user.id })
			.andWhere("role.id != :id", { id: enumRole.ADMIN })
			.andWhere("user.isActive = :isActive", { isActive: true })
			.getOne()

		return userRepository;
	}

	async profile(user: User) {
		const userRepository = await this.userRepository.createQueryBuilder("user")
			.leftJoinAndSelect("user.role", "role")
			.select([
				"user.id",
				"user.firstName",
				"user.lastName",
				"user.gender",
				"user.email",
				"user.phone",
				"role.name",
				"user.username",
				"user.avatar"
			])
			.where("user.id = :id", { id: user.id })
			.getOne()

		return userRepository;
	}

	async becomeShopper(user: User) {
		const { id } = user;
		const checkActiveUser = await this.authService.validateActiveUser(id.toString());

		if (!checkActiveUser) {
			throw new HttpException("Your account already lock", HttpStatus.BAD_REQUEST)
		}

		const userRepository = await this.userRepository.findOne({
			select: {
				id: true,
				roleId: true
			},
			where: {
				id,
				roleId: Not(enumRole.ADMIN)
			}
		});

		if (!userRepository) {
			throw new HttpException("User not found", HttpStatus.BAD_REQUEST)
		}

		if (userRepository && userRepository.roleId === enumRole.SHOPPER) {
			return {
				data: userRepository
			}
		}

		const updateRole = await this.userRepository.save({
			id,
			role: {
				id: enumRole.SHOPPER
			}
		})

		return {
			status: "Become shop success!",
			data: updateRole
		}
	}

	async getRole(user: User) {
		const { id } = user;

		const checkActiveUser = await this.authService.validateActiveUser(id.toString());

		if (!checkActiveUser) {
			throw new HttpException("Your account already lock", HttpStatus.BAD_REQUEST)
		}

		const userRepository = await this.userRepository.findOne({
			where: { id },
			relations: ["role"]
		});

		if (!userRepository) {
			throw new HttpException("User not found", HttpStatus.BAD_REQUEST)
		}

		return {
			status: "Get role success!",
			data: userRepository.role.name
		}
	}

	async editProfile(user: User, UpdateUserDto: UpdateUserDto) {

		const userRepository = await this.userRepository.findOne({
			where: { id: user.id, }
		});

		if (!userRepository) {
			throw new HttpException("User not found", HttpStatus.BAD_REQUEST)
		}

		const validatePhone = await this.authService.validatePhone({
			phone: UpdateUserDto.phone,
			id: user.id.toString()
		})

		if (!validatePhone) {
			throw new HttpException(`Phone ${UpdateUserDto.phone} already exists`, HttpStatus.BAD_REQUEST);
		}

		const updateUser = await this.userRepository.save({
			...UpdateUserDto,
			id: user.id
		});

		return {
			message: "Update profile success!",
			data: updateUser
		}
	}

	async uploadAvatar(user: User, file: Array<Express.Multer.File>) {
		const { id } = user;
		const avatarPath = file.join("");

		const userRepository = await this.userRepository.findOne({
			where: { id }
		});

		if (!userRepository) {
			throw new HttpException("User not found", HttpStatus.BAD_REQUEST)
		}

		const updateUser = await this.userRepository.save({
			avatar: avatarPath,
			id
		});

		return {
			status: "Upload avatar success!",
			data: updateUser
		}
	}

	async addUserToGroup(user: User, body: addUserToGroupDto) {
		const { id } = user;
		const { groupId } = body;

		const userRepository = await this.userRepository.findOne({
			where: { id }
		});

		if (!userRepository) {
			throw new HttpException("User not found", HttpStatus.BAD_REQUEST)
		}

		const updateUser = await this.userRepository.save({
			groupId: +groupId,
			id
		});

		return {
			status: "Add user to group success!",
			data: updateUser
		}
	}

	async getTotalUser(user: User) {
		const getRole = await this.getRole(user)

		if (getRole.data !== 'ADMIN'.trim()) {
			throw new ForbiddenException()
		}

		const userRepository = await this.userRepository.createQueryBuilder("user")
			.where("user.roleId != :id", { id: enumRole.ADMIN })
			.getCount()
		return {
			data: userRepository
		}

	}
}
