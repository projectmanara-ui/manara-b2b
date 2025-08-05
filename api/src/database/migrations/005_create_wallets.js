exports.up = function(knex) {
  return knex.schema.createTable('wallets', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.decimal('balance', 10, 2).notNullable().defaultTo(0);
    table.decimal('monthly_allowance', 10, 2).notNullable().defaultTo(0);
    table.string('currency', 3).notNullable().defaultTo('KES');
    table.date('allowance_reset_date');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
    
    table.unique(['user_id']);
    table.index(['user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('wallets');
};