import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (knex.client.config.client === "sqlite3") {
        await knex.schema.alterTable('transactions', (table) => {
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).alter()
        })
    } else if (knex.client.config.client === "pg") {
        await knex.raw(`ALTER TABLE transactions ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP`)
    }
}


export async function down(knex: Knex): Promise<void> {
    if (knex.client.config.client === 'sqlite3') {
        await knex.schema.alterTable('transactions', (table) => {
            table.timestamp('created_at').defaultTo(null).alter();
        });
    } else if (knex.client.config.client === 'pg') {
        await knex.raw(`ALTER TABLE transactions ALTER COLUMN created_at DROP DEFAULT`);
    }
}

