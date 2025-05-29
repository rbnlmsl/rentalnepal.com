import { PrismaClient, PropertyType, PropertyStatus, PriceFrequency } from '../src/generated/prisma';
import { randomUUID } from 'crypto';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Sample landlord IDs (in a real app, these would be actual user IDs)
const landlordIds = [
  randomUUID(),
  randomUUID(),
  randomUUID(),
  randomUUID(),
  randomUUID(),
];

// Sample amenities
const amenitiesList = [
  'parking',
  'pet-friendly',
  'furnished',
  'balcony',
  'garden',
  'security',
  'air-conditioning',
  'washing-machine',
  'wifi',
  'gym',
  'swimming-pool',
  'elevator',
  'wheelchair-accessible',
  'solar-power',
  'water-filter',
  'backup-power',
];

// Sample image URLs (in a real app, these would be actual image URLs)
const sampleImages = [
  '/images/property-1.jpg',
  '/images/property-2.jpg',
  '/images/property-3.jpg',
  '/images/property-4.jpg',
];

// Sample properties data
const properties = [
  // Kathmandu properties
  {
    title: 'Modern Apartment in Baluwatar',
    description: 'A beautiful, modern apartment in the heart of Baluwatar. Close to embassies and diplomatic missions.',
    addressLine1: 'Baluwatar Heights, Ward 4',
    addressLine2: 'Near Russian Embassy',
    city: 'Kathmandu',
    province: 'Bagmati',
    postcode: '44600',
    latitude: 27.7352,
    longitude: 85.3373,
    propertyType: PropertyType.APARTMENT,
    rentAmount: 65000,
    depositAmount: 130000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1200,
    amenities: ['parking', 'security', 'backup-power', 'water-filter', 'elevator'],
    availabilityDate: new Date('2025-06-15'),
    status: PropertyStatus.AVAILABLE,
    images: sampleImages,
  },
  {
    title: 'Cozy Studio in Thamel',
    description: 'Perfect studio apartment for singles or couples in the tourist hub of Thamel.',
    addressLine1: 'Thamel Marg, Ward 1',
    city: 'Kathmandu',
    province: 'Bagmati',
    postcode: '44600',
    latitude: 27.7154,
    longitude: 85.3123,
    propertyType: PropertyType.STUDIO,
    rentAmount: 25000,
    depositAmount: 50000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 450,
    amenities: ['furnished', 'wifi', 'washing-machine'],
    availabilityDate: new Date('2025-06-01'),
    status: PropertyStatus.AVAILABLE,
    images: [sampleImages[1]],
  },
  {
    title: 'Luxury House in Budhanilkantha',
    description: 'Spacious luxury house with garden and mountain views in peaceful Budhanilkantha.',
    addressLine1: 'Budhanilkantha Heights, Ward 3',
    addressLine2: 'Near Shivapuri National Park',
    city: 'Kathmandu',
    province: 'Bagmati',
    postcode: '44600',
    latitude: 27.7667,
    longitude: 85.3667,
    propertyType: PropertyType.HOUSE,
    rentAmount: 120000,
    depositAmount: 240000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 5,
    bathrooms: 4,
    areaSqft: 3500,
    amenities: ['parking', 'garden', 'security', 'backup-power', 'solar-power', 'water-filter'],
    availabilityDate: new Date('2025-07-01'),
    status: PropertyStatus.AVAILABLE,
    images: sampleImages,
  },
  {
    title: 'Single Room in Chabahil',
    description: 'Affordable single room for students or working professionals in Chabahil area.',
    addressLine1: 'Chabahil Ring Road, Ward 7',
    city: 'Kathmandu',
    province: 'Bagmati',
    postcode: '44600',
    latitude: 27.7211,
    longitude: 85.3419,
    propertyType: PropertyType.ROOM,
    rentAmount: 8000,
    depositAmount: 16000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 120,
    amenities: ['wifi'],
    availabilityDate: new Date('2025-05-15'),
    status: PropertyStatus.AVAILABLE,
    images: [sampleImages[2]],
  },
  
  // Lalitpur properties
  {
    title: 'Heritage Apartment in Patan',
    description: 'Beautiful apartment in a renovated Newari house near Patan Durbar Square.',
    addressLine1: 'Patan Dhoka, Ward 16',
    addressLine2: '200m from Patan Durbar Square',
    city: 'Lalitpur',
    province: 'Bagmati',
    postcode: '44700',
    latitude: 27.6710,
    longitude: 85.3252,
    propertyType: PropertyType.APARTMENT,
    rentAmount: 45000,
    depositAmount: 90000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 2,
    bathrooms: 1,
    areaSqft: 850,
    amenities: ['furnished', 'wifi', 'backup-power', 'water-filter'],
    availabilityDate: new Date('2025-06-01'),
    status: PropertyStatus.AVAILABLE,
    images: [sampleImages[0], sampleImages[3]],
  },
  {
    title: 'Modern Townhouse in Jawalakhel',
    description: 'Contemporary townhouse with all amenities in upscale Jawalakhel area.',
    addressLine1: 'Jawalakhel Road, Ward 4',
    city: 'Lalitpur',
    province: 'Bagmati',
    postcode: '44700',
    latitude: 27.6673,
    longitude: 85.3144,
    propertyType: PropertyType.TOWNHOUSE,
    rentAmount: 80000,
    depositAmount: 160000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 4,
    bathrooms: 3,
    areaSqft: 2200,
    amenities: ['parking', 'garden', 'security', 'air-conditioning', 'washing-machine', 'wifi', 'backup-power'],
    availabilityDate: new Date('2025-07-15'),
    status: PropertyStatus.AVAILABLE,
    images: sampleImages,
  },
  
  // Bhaktapur properties
  {
    title: 'Traditional House in Bhaktapur',
    description: 'Experience living in a traditional Newari house in the ancient city of Bhaktapur.',
    addressLine1: 'Pottery Square, Ward 9',
    addressLine2: 'Near Nyatapola Temple',
    city: 'Bhaktapur',
    province: 'Bagmati',
    postcode: '44800',
    latitude: 27.6718,
    longitude: 85.4284,
    propertyType: PropertyType.HOUSE,
    rentAmount: 35000,
    depositAmount: 70000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 2,
    bathrooms: 1,
    areaSqft: 1000,
    amenities: ['furnished', 'water-filter'],
    availabilityDate: new Date('2025-06-01'),
    status: PropertyStatus.AVAILABLE,
    images: [sampleImages[1], sampleImages[2]],
  },
  
  // Pokhara properties
  {
    title: 'Lakeside Apartment in Pokhara',
    description: 'Beautiful apartment with stunning views of Phewa Lake and the Annapurna range.',
    addressLine1: 'Lakeside Road, Ward 6',
    addressLine2: '100m from Phewa Lake',
    city: 'Pokhara',
    province: 'Gandaki',
    postcode: '33700',
    latitude: 28.2096,
    longitude: 83.9856,
    propertyType: PropertyType.APARTMENT,
    rentAmount: 40000,
    depositAmount: 80000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 900,
    amenities: ['furnished', 'balcony', 'wifi', 'security', 'backup-power'],
    availabilityDate: new Date('2025-05-15'),
    status: PropertyStatus.AVAILABLE,
    images: sampleImages,
  },
  {
    title: 'Tourist Villa in Sarangkot',
    description: 'Exclusive villa with panoramic mountain views, perfect for tourists or digital nomads.',
    addressLine1: 'Sarangkot Hill, Ward 18',
    city: 'Pokhara',
    province: 'Gandaki',
    postcode: '33700',
    latitude: 28.2438,
    longitude: 83.9845,
    propertyType: PropertyType.VILLA,
    rentAmount: 90000,
    depositAmount: 180000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2500,
    amenities: ['furnished', 'garden', 'balcony', 'parking', 'security', 'wifi', 'air-conditioning', 'solar-power'],
    availabilityDate: new Date('2025-06-01'),
    status: PropertyStatus.AVAILABLE,
    images: sampleImages,
  },
  
  // Chitwan properties
  {
    title: 'Jungle Retreat in Sauraha',
    description: 'Peaceful house near Chitwan National Park, perfect for nature lovers.',
    addressLine1: 'Sauraha Road, Ward 4',
    addressLine2: '500m from Chitwan National Park entrance',
    city: 'Chitwan',
    province: 'Bagmati',
    postcode: '44200',
    latitude: 27.5813,
    longitude: 84.4988,
    propertyType: PropertyType.HOUSE,
    rentAmount: 30000,
    depositAmount: 60000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    amenities: ['furnished', 'garden', 'air-conditioning', 'wifi', 'parking'],
    availabilityDate: new Date('2025-07-01'),
    status: PropertyStatus.AVAILABLE,
    images: [sampleImages[0], sampleImages[3]],
  },
  
  // Biratnagar properties
  {
    title: 'Commercial Space in Biratnagar',
    description: 'Prime commercial space in the business district of Biratnagar.',
    addressLine1: 'Main Road, Ward 10',
    city: 'Biratnagar',
    province: 'Province 1',
    postcode: '56613',
    latitude: 26.4509,
    longitude: 87.2701,
    propertyType: PropertyType.COMMERCIAL,
    rentAmount: 50000,
    depositAmount: 100000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 0,
    bathrooms: 1,
    areaSqft: 1500,
    amenities: ['parking', 'security', 'backup-power', 'air-conditioning'],
    availabilityDate: new Date('2025-06-15'),
    status: PropertyStatus.AVAILABLE,
    images: [sampleImages[2]],
  },
  
  // Additional properties with different statuses
  {
    title: 'Rented Apartment in Baluwatar',
    description: 'This apartment is currently rented but will be available soon.',
    addressLine1: 'Baluwatar Heights, Ward 4',
    city: 'Kathmandu',
    province: 'Bagmati',
    postcode: '44600',
    latitude: 27.7360,
    longitude: 85.3380,
    propertyType: PropertyType.APARTMENT,
    rentAmount: 55000,
    depositAmount: 110000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1000,
    amenities: ['parking', 'security', 'elevator'],
    availabilityDate: new Date('2025-08-01'),
    status: PropertyStatus.RENTED,
    images: [sampleImages[1]],
  },
  {
    title: 'Maintenance House in Lazimpat',
    description: 'This property is currently under maintenance and will be available soon.',
    addressLine1: 'Lazimpat Road, Ward 2',
    city: 'Kathmandu',
    province: 'Bagmati',
    postcode: '44600',
    latitude: 27.7200,
    longitude: 85.3230,
    propertyType: PropertyType.HOUSE,
    rentAmount: 75000,
    depositAmount: 150000,
    priceFrequency: PriceFrequency.PM,
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1800,
    amenities: ['parking', 'garden', 'security'],
    availabilityDate: new Date('2025-09-01'),
    status: PropertyStatus.MAINTENANCE,
    images: [sampleImages[3]],
  },
];

// Main seed function
async function seed() {
  console.log('Starting database seed...');

  try {
    // Clean the database first
    console.log('Cleaning existing data...');
    await prisma.property.deleteMany({});
    console.log('Database cleaned successfully');

    // Create properties with random landlord IDs
    console.log('Creating sample properties...');
    for (const property of properties) {
      const landlordId = landlordIds[Math.floor(Math.random() * landlordIds.length)];
      
      await prisma.property.create({
        data: {
          ...property,
          landlordId,
        },
      });
    }

    console.log(`Created ${properties.length} sample properties`);

    // Update the PostGIS location column for all properties
    console.log('Updating PostGIS location data...');
    await prisma.$executeRaw`
      UPDATE "Property" 
      SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
      WHERE location IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL
    `;
    console.log('PostGIS location data updated successfully');

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seed function
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
