import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import InitSeeder from './src/database/seeders/init.seeder';
const options: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD.toString(),
	database: process.env.DB_NAME,
	logging: true,
	synchronize: true,
	entities: [`src/**/**.entity{.ts,.js}`],
	migrations: ['dist/migrations/*.js'],
	seeds: [InitSeeder]
}


export default new DataSource(options);