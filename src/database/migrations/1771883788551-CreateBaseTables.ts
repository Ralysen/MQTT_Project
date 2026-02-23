import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBaseTables1771883788551 implements MigrationInterface {
    name = 'CreateBaseTables1771883788551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "devices" ("id" SERIAL NOT NULL, "device_id" character varying NOT NULL, "name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2667f40edb344d6f274a0d42b6f" UNIQUE ("device_id"), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "localisation" ("id" SERIAL NOT NULL, "latitude" numeric(10,7) NOT NULL, "longitude" numeric(10,7) NOT NULL, "altitude" numeric(7,2), "recorded_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "device_id" integer NOT NULL, CONSTRAINT "PK_296b44eea08ff6807f4430650dd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_localisation_recorded_at" ON "localisation" ("recorded_at") `);
        await queryRunner.query(`CREATE INDEX "idx_localisation_device_recorded_at" ON "localisation" ("device_id", "recorded_at") `);
        await queryRunner.query(`ALTER TABLE "localisation" ADD CONSTRAINT "FK_4fa8ca878994831701bb8859065" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "localisation" DROP CONSTRAINT "FK_4fa8ca878994831701bb8859065"`);
        await queryRunner.query(`DROP INDEX "public"."idx_localisation_device_recorded_at"`);
        await queryRunner.query(`DROP INDEX "public"."idx_localisation_recorded_at"`);
        await queryRunner.query(`DROP TABLE "localisation"`);
        await queryRunner.query(`DROP TABLE "devices"`);
    }

}
