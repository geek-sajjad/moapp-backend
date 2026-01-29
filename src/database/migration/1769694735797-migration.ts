import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769694735797 implements MigrationInterface {
    name = 'Migration1769694735797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_admins" DROP COLUMN "isSuperAdmin"`);
        await queryRunner.query(`ALTER TABLE "user_admins" DROP COLUMN "lastLoginAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_admins" ADD "lastLoginAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_admins" ADD "isSuperAdmin" boolean NOT NULL DEFAULT false`);
    }

}
