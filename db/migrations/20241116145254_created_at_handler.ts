import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
      if (knex.client.config.client === 'sqlite3') {
        table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable().alter();
      } else if (knex.client.config.client === 'pg') {
        table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable().alter();
      }
    });
  }
  
  export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('transactions', (table) => {
      table.timestamp('created_at').alter();
    });
  }
  

