import {MigrationInterface, QueryRunner, Table} from 'typeorm';

import {StatusOfTodo} from '../types';

export class Todo1608834399088 implements MigrationInterface {
  name = 'Todo1608834399088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'todos',
        engine: 'InnoDB',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(StatusOfTodo),
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            isNullable: true,
            default: 'NOW()',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            isNullable: true,
            default: 'NOW()',
            onUpdate: 'NOW()',
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `todos`');
  }
}
