exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('organizations').del();
  
  // Inserts seed entries
  await knex('organizations').insert([
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Safaricom PLC',
      slug: 'safaricom-plc',
      description: 'Leading telecommunications company in Kenya',
      monthly_allowance: 8000.00,
      currency: 'KES',
      settings: JSON.stringify({
        working_hours: {
          start: '07:00',
          end: '17:00'
        },
        shift_types: ['morning', 'afternoon', 'night'],
        max_advance_booking_days: 7
      })
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Equity Bank Kenya',
      slug: 'equity-bank-kenya',
      description: 'Leading financial services provider',
      monthly_allowance: 6500.00,
      currency: 'KES',
      settings: JSON.stringify({
        working_hours: {
          start: '08:00',
          end: '17:00'
        },
        shift_types: ['morning', 'afternoon'],
        max_advance_booking_days: 5
      })
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Kenya Airways',
      slug: 'kenya-airways',
      description: 'National flag carrier airline of Kenya',
      monthly_allowance: 7500.00,
      currency: 'KES',
      settings: JSON.stringify({
        working_hours: {
          start: '06:00',
          end: '22:00'
        },
        shift_types: ['morning', 'afternoon', 'night'],
        max_advance_booking_days: 14
      })
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Nairobi Hospital',
      slug: 'nairobi-hospital',
      description: 'Leading private healthcare provider',
      monthly_allowance: 5000.00,
      currency: 'KES',
      settings: JSON.stringify({
        working_hours: {
          start: '00:00',
          end: '23:59'
        },
        shift_types: ['morning', 'afternoon', 'night'],
        max_advance_booking_days: 7
      })
    }
  ]);
};