import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1770305561801 implements MigrationInterface {
    name = 'Migration1770305561801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "fullName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e15d62fc91a93136c374a640037" UNIQUE ("username"), CONSTRAINT "UQ_43e724629153adcbd492e387bdc" UNIQUE ("email"), CONSTRAINT "PK_d2acc43f0f0d6dad76c4299da5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "amount" numeric(15,2) NOT NULL DEFAULT '0', "type" character varying NOT NULL, "date" date NOT NULL, "description" text, "user_id" uuid NOT NULL, "customer_id" uuid NOT NULL, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" text, "phone_number" character varying, "is_archived" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "fullName" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "password" character varying NOT NULL, "subscriptionEndDate" TIMESTAMP, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "version" ("id" SERIAL NOT NULL, "version" character varying(10) NOT NULL DEFAULT '1.0.0', "releaseDate" date NOT NULL, "forceUpdate" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_4fb5fbb15a43da9f35493107b1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."action_logs_action_type_enum" AS ENUM('AUTH.LOGIN', 'AUTH.LOGOUT', 'AUTH.REGISTER', 'AUTH.PASSWORD_RESET', 'AUTH.PASSWORD_CHANGE', 'AUTH.TOKEN_REFRESH', 'USER.PROFILE_VIEW', 'USER.PROFILE_UPDATE', 'USER.ME_ENDPOINT_ACCESS', 'PRODUCT.VIEW', 'PRODUCT.SEARCH', 'PRODUCT.FILTER', 'PAYMENT.INITIATE', 'PAYMENT.SUCCESS', 'PAYMENT.FAIL', 'PAYMENT.REFUND')`);
        await queryRunner.query(`CREATE TABLE "action_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "action_type" "public"."action_logs_action_type_enum" NOT NULL, "module" character varying NOT NULL, "metadata" jsonb, "description" character varying, "ip_address" character varying, "user_agent" character varying, "related_entity_id" character varying, CONSTRAINT "PK_cc15d2a348eaf2e1e153055380c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_6f09843c214f21a462b54b11e8d" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "action_logs" ADD CONSTRAINT "FK_1174018b7357cd7965ae1ade1c5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action_logs" DROP CONSTRAINT "FK_1174018b7357cd7965ae1ade1c5"`);
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_11d81cd7be87b6f8865b0cf7661"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_6f09843c214f21a462b54b11e8d"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`);
        await queryRunner.query(`DROP TABLE "action_logs"`);
        await queryRunner.query(`DROP TYPE "public"."action_logs_action_type_enum"`);
        await queryRunner.query(`DROP TABLE "version"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TABLE "user_admins"`);
    }

}
