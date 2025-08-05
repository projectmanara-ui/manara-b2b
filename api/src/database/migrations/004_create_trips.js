exports.up = function(knex) {
  return knex.schema.createTable('trips', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.enum('type', ['to_work', 'from_work']).notNullable();
    table.enum('status', ['booked', 'confirmed', 'in_transit', 'completed', 'cancelled']).notNullable().defaultTo('booked');
    table.uuid('pickup_location_id').references('id').inTable('locations').onDelete('RESTRICT');
    table.uuid('drop_location_id').references('id').inTable('locations').onDelete('RESTRICT');
    table.timestamp('scheduled_time').notNullable();
    table.timestamp('actual_pickup_time');
    table.timestamp('actual_drop_time');
    table.decimal('fare', 8, 2).notNullable().defaultTo(0);
    table.string('driver_id');
    table.string('vehicle_id');
    table.text('route_data');
    table.integer('estimated_duration'); // in minutes
    table.text('notes');
    table.json('tracking_data').defaultTo('{}');
    table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).notNullable().defaultTo('pending');
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['status']);
    table.index(['scheduled_time']);
    table.index(['pickup_location_id']);
    table.index(['drop_location_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('trips');
};