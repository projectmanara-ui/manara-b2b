exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('wallet_id').references('id').inTable('wallets').onDelete('CASCADE');
    table.enum('type', ['deduction', 'allowance', 'refund', 'adjustment']).notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.text('description').notNullable();
    table.uuid('trip_id').references('id').inTable('trips').onDelete('SET NULL');
    table.string('reference_id');
    table.json('metadata').defaultTo('{}');
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['wallet_id']);
    table.index(['type']);
    table.index(['trip_id']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};