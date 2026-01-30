import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1769783442541 implements MigrationInterface {
    name = 'Migration1769783442541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "debitAmount"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "creditAmount"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "amount" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "type" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "creditAmount" numeric(15,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "debitAmount" numeric(15,2) NOT NULL DEFAULT '0'`);
    }

}
