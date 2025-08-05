exports.up = function(knex) {
  return knex.schema.createTable('organizations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.string('slug', 50).unique().notNullable();
    table.text('description');
    table.string('logo_url');
    table.decimal('monthly_allowance', 10, 2).notNullable().defaultTo(0);
    table.string('currency', 3).notNullable().defaultTo('KES');
    table.json('settings').defaultTo('{}');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('organizations');
};