exports.up = function(knex) {
  return knex.schema.createTable('emergency_alerts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('trip_id').references('id').inTable('trips').onDelete('SET NULL');
    table.enum('type', ['medical', 'security', 'breakdown', 'other']).notNullable();
    table.enum('status', ['active', 'resolved', 'cancelled']).notNullable().defaultTo('active');
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.text('message');
    table.timestamp('resolved_at');
    table.uuid('resolved_by').references('id').inTable('users').onDelete('SET NULL');
    table.text('resolution_notes');
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['status']);
    table.index(['type']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('emergency_alerts');
};