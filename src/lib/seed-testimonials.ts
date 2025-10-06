import { createTestimonial } from './testimonials';

const seedTestimonials = [
  {
    userId: 'seed-user-1',
    userEmail: 'sarah.johnson@example.com',
    userName: 'Sarah Johnson',
    userLocation: 'New York, USA',
    rating: 5,
    title: 'Absolutely Magical Desert Experience!',
    message: 'An absolutely magical experience! The authentic desert lifestyle, warm hospitality, and organic food made our stay unforgettable. Dr. Devaram and Dhapu are wonderful hosts who truly care about preserving traditional culture while providing modern comfort.',
    experience: 'Desert Explorer Package',
    status: 'approved' as const,
    featured: true,
    visible: true
  },
  {
    userId: 'seed-user-2',
    userEmail: 'rajesh.sharma@example.com',
    userName: 'Rajesh Sharma',
    userLocation: 'Mumbai, India',
    rating: 5,
    title: 'Perfect Blend of Adventure and Culture',
    message: 'Perfect blend of adventure and culture. The camel safari at sunset was breathtaking, and the traditional performances were mesmerizing. The organic food was incredibly fresh and delicious. Highly recommended for anyone seeking authentic Rajasthani experience!',
    experience: 'Cultural Heritage Package',
    status: 'approved' as const,
    featured: true,
    visible: true
  },
  {
    userId: 'seed-user-3',
    userEmail: 'emma.wilson@example.com',
    userName: 'Emma Wilson',
    userLocation: 'London, UK',
    rating: 5,
    title: 'Exceptional Organic Products',
    message: 'The organic products are exceptional! Fresh goat milk, traditional grains, and desert vegetables - everything was pure and delicious. A true farm-to-table experience that you cannot find anywhere else. The sustainability practices are truly inspiring.',
    experience: 'Farm Visit & Products',
    status: 'approved' as const,
    featured: true,
    visible: true
  },
  {
    userId: 'seed-user-4',
    userEmail: 'amit.patel@example.com',
    userName: 'Amit Patel',
    userLocation: 'Delhi, India',
    rating: 5,
    title: 'Educational and Inspiring Farm Stay',
    message: 'Educational and inspiring! Learning about sustainable farming in the desert was fascinating. The mud house accommodation was surprisingly comfortable and authentic. The hosts shared so much knowledge about traditional farming methods.',
    experience: 'Farm Stay Experience',
    status: 'approved' as const,
    featured: false,
    visible: true
  },
  {
    userId: 'seed-user-5',
    userEmail: 'maria.garcia@example.com',
    userName: 'Maria Garcia',
    userLocation: 'Barcelona, Spain',
    rating: 4,
    title: 'Wonderful Cultural Immersion',
    message: 'A wonderful cultural immersion experience. The traditional dance performances and local music were captivating. The food was authentic and delicious. The only minor issue was the language barrier, but the warmth of the hosts made up for it.',
    experience: 'Traditional Performances',
    status: 'approved' as const,
    featured: false,
    visible: true
  },
  {
    userId: 'seed-user-6',
    userEmail: 'john.smith@example.com',
    userName: 'John Smith',
    userLocation: 'Sydney, Australia',
    rating: 5,
    title: 'Unforgettable Desert Adventure',
    message: 'An unforgettable desert adventure! The jeep safari through the sand dunes was thrilling, and the sunset camel ride was magical. The hospitality was exceptional, and the organic meals were the best I have ever had. Will definitely return!',
    experience: 'Desert Adventure',
    status: 'approved' as const,
    featured: false,
    visible: true
  },
  {
    userId: 'seed-user-7',
    userEmail: 'lisa.chen@example.com',
    userName: 'Lisa Chen',
    userLocation: 'Singapore',
    rating: 5,
    title: 'Peaceful and Authentic',
    message: 'Such a peaceful and authentic experience away from city life. The mud house was comfortable and the organic food was incredibly fresh. Learning about traditional farming methods was fascinating. Perfect for digital detox!',
    experience: 'Mud House Stay',
    status: 'approved' as const,
    featured: false,
    visible: true
  },
  {
    userId: 'seed-user-8',
    userEmail: 'david.brown@example.com',
    userName: 'David Brown',
    userLocation: 'Toronto, Canada',
    rating: 4,
    title: 'Great Photography Opportunities',
    message: 'Amazing photography opportunities throughout the stay. The golden hour shots in the desert were spectacular. The hosts were very accommodating for photography needs. The traditional architecture and desert landscapes provided endless inspiration.',
    experience: 'Photography Tour',
    status: 'approved' as const,
    featured: false,
    visible: true
  }
];

export async function seedTestimonialsData() {
  console.log('Starting to seed testimonials...');
  
  for (const testimonial of seedTestimonials) {
    try {
      await createTestimonial(testimonial);
      console.log(`Created testimonial for ${testimonial.userName}`);
    } catch (error) {
      console.error(`Error creating testimonial for ${testimonial.userName}:`, error);
    }
  }
  
  console.log('Finished seeding testimonials!');
}