import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordToUser1786972114151 implements MigrationInterface {
  name = 'AddPasswordToUser1786972114151';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the password column as nullable first
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD "password" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "password"
    `);
  }
}
