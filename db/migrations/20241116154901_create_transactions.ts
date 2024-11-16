import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary()
        table.uuid('session_id').index()
        table.text('title').notNullable()
        table.decimal('amount', 10, 2).notNullable()
        
        if (knex.client.config.client === 'pg') {
            // PostgreSQL: Default value for created_at is the current timestamp
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        } else if (knex.client.config.client === 'sqlite3') {
            // SQLite: Default value is CURRENT_TIMESTAMP for created_at
            table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        } else {
            // For other clients, fallback to PostgreSQL behavior or custom logic
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        }
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions');
}
