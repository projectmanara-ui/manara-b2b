exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 100).notNullable();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('phone', 20);
    table.uuid('organization_id').references('id').inTable('organizations').onDelete('CASCADE');
    table.string('employee_id', 50);
    table.string('role').notNullable().defaultTo('employee');
    table.string('profile_image_url');
    table.json('emergency_contact');
    table.json('shift_preferences').defaultTo('{}');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.string('verification_token');
    table.timestamp('last_login');
    table.timestamps(true, true);
    
    table.index(['organization_id']);
    table.index(['email']);
    table.unique(['organization_id', 'employee_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};