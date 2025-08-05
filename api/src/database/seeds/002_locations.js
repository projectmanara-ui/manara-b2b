exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('locations').del();
  
  // Inserts seed entries
  await knex('locations').insert([
    // Pickup points
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Westlands Square',
      address: 'Westlands Square, Westlands, Nairobi',
      latitude: -1.2676,
      longitude: 36.8108,
      type: 'pickup_point',
      organization_id: null, // Available to all organizations
      metadata: JSON.stringify({
        capacity: 50,
        facilities: ['waiting_area', 'security', 'lighting']
      })
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440002',
      name: 'CBD Bus Station',
      address: 'Central Business District, Nairobi',
      latitude: -1.2864,
      longitude: 36.8172,
      type: 'pickup_point',
      organization_id: null,
      metadata: JSON.stringify({
        capacity: 100,
        facilities: ['waiting_area', 'security', 'lighting', 'shelter']
      })
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440003',
      name: 'Eastlands Terminal',
      address: 'Eastlands, Nairobi',
      latitude: -1.2921,
      longitude: 36.8219,
      type: 'pickup_point',
      organization_id: null,
      metadata: JSON.stringify({
        capacity: 75,
        facilities: ['waiting_area', 'security', 'lighting']
      })
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440004',
      name: 'Karen Shopping Centre',
      address: 'Karen Shopping Centre, Karen, Nairobi',
      latitude: -1.3197,
      longitude: 36.7085,
      type: 'pickup_point',
      organization_id: null,
      metadata: JSON.stringify({
        capacity: 30,
        facilities: ['waiting_area', 'security', 'lighting', 'parking']
      })
    },
    // Office locations
    {
      id: '660e8400-e29b-41d4-a716-446655440005',
      name: 'Safaricom Headquarters',
      address: 'Safaricom House, Westlands, Nairobi',
      latitude: -1.2630,
      longitude: 36.8063,
      type: 'office',
      organization_id: '550e8400-e29b-41d4-a716-446655440001',
      metadata: JSON.stringify({
        building_floors: 15,
        parking_available: true
      })
    },
    {
      id: '660e8400-e29b-41d4-a716-446655440006',
      name: 'Equity Centre',
      address: 'Equity Centre, Upper Hill, Nairobi',
      latitude: -1.2921,
      longitude: 36.7833,
      type: 'office',
      organization_id: '550e8400-e29b-41d4-a716-446655440002',
      metadata: JSON.stringify({
        building_floors: 12,
        parking_available: true
      })
    }
  ]);
};