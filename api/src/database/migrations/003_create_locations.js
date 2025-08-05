exports.up = function(knex) {
  return knex.schema.createTable('locations', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.text('address').notNullable();
    table.decimal('latitude', 10, 8).notNullable();
    table.decimal('longitude', 11, 8).notNullable();
    table.enum('type', ['pickup_point', 'office', 'home']).notNullable();
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.uuid('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.json('metadata').defaultTo('{}');
    table.timestamps(true, true);
    
    table.index(['organization_id']);
    table.index(['type']);
    table.index(['latitude', 'longitude']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('locations');
};