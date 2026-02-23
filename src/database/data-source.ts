import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const username = process.env['DB_USER'];
const password = process.env['DB_PASSWORD'];
const database = process.env['DB_NAME'];

if (!username || !password || !database) {
  throw new Error(
    'Missing required database environment variables: DB_USER, DB_PASSWORD, DB_NAME',
  );
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: parseInt(process.env['DB_PORT'] ?? '5432', 10),
  username,
  password,
  database,
  synchronize: false,
  logging: process.env['NODE_ENV'] === 'development',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
