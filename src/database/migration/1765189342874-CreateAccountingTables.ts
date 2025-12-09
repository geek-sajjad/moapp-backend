import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountingTables1765189342874 implements MigrationInterface {
  name = 'CreateAccountingTables1765189342874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL,
        "email" character varying,
        "phoneNumber" character varying NOT NULL,
        "fullName" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'USER',
        "isActive" boolean NOT NULL DEFAULT true,
        "firebaseToken" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_phoneNumber" UNIQUE ("phoneNumber"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create user_profiles table
    await queryRunner.query(`
      CREATE TABLE "user_profiles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "bio" character varying,
        "address" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_profiles_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_user_profiles_user_id" FOREIGN KEY ("user_id") 
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create contacts table
    await queryRunner.query(`
      CREATE TABLE "contacts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "phoneNumber" character varying,
        "user_id" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contacts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_contacts_user_id" FOREIGN KEY ("user_id") 
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create transactions table
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "amount" numeric(15,2) NOT NULL,
        "date" date NOT NULL,
        "type" character varying NOT NULL,
        "description" text,
        "contact_id" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_transactions_contact_id" FOREIGN KEY ("contact_id") 
          REFERENCES "contacts"("id") ON DELETE CASCADE,
        CONSTRAINT "CHK_transactions_type" CHECK ("type" IN ('DEBIT', 'CREDIT'))
      )
    `);

    // Create indexes for better query performance
    await queryRunner.query(
      `CREATE INDEX "IDX_contacts_user_id" ON "contacts" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_contact_id" ON "transactions" ("contact_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_date" ON "transactions" ("date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_transactions_type" ON "transactions" ("type")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_transactions_type"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_date"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_contact_id"`);
    await queryRunner.query(`DROP INDEX "IDX_contacts_user_id"`);

    // Drop tables in reverse order (to respect foreign keys)
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
