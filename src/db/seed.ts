import 'dotenv/config';
import { db } from './index';
import { resources } from './schema';

async function main() {
  console.log('🌱 Seeding database...');

  // Sample resources for Software Engineering
  const softwareEngineeringResources = [
    {
      title: 'React Official Documentation',
      description: 'Comprehensive guide to React fundamentals, hooks, and best practices. Perfect for learning component-based architecture.',
      url: 'https://react.dev',
      type: 'article',
      domain: 'software-engineering',
      difficulty: 'Beginner',
    },
    {
      title: 'Next.js 14 Full Course - Build and Deploy',
      description: 'Complete tutorial covering Next.js App Router, Server Components, Server Actions, and deployment on Vercel.',
      url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
      type: 'video',
      domain: 'software-engineering',
      difficulty: 'Intermediate',
    },
    {
      title: 'TypeScript Handbook',
      description: 'Master TypeScript from basics to advanced topics including generics, decorators, and type inference.',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      type: 'course',
      domain: 'software-engineering',
      difficulty: 'Beginner',
    },
  ];

  // Sample resources for Data Science
  const dataScienceResources = [
    {
      title: 'Python for Beginners - Full Course',
      description: 'Learn Python programming from scratch: variables, functions, loops, and object-oriented programming.',
      url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
      type: 'video',
      domain: 'data-science',
      difficulty: 'Beginner',
    },
    {
      title: 'Pandas Documentation - Getting Started',
      description: 'Essential guide to data manipulation with Pandas: DataFrames, series, grouping, and data cleaning techniques.',
      url: 'https://pandas.pydata.org/docs/getting_started/index.html',
      type: 'article',
      domain: 'data-science',
      difficulty: 'Intermediate',
    },
    {
      title: 'Machine Learning Crash Course by Google',
      description: 'Introduction to machine learning concepts, supervised learning, neural networks, and real-world ML applications.',
      url: 'https://developers.google.com/machine-learning/crash-course',
      type: 'course',
      domain: 'data-science',
      difficulty: 'Intermediate',
    },
  ];

  // Sample resources for Product Design
  const productDesignResources = [
    {
      title: 'Figma Tutorial for Beginners',
      description: 'Learn Figma from basics: frames, components, auto-layout, prototyping, and collaborative design workflows.',
      url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
      type: 'video',
      domain: 'product-design',
      difficulty: 'Beginner',
    },
    {
      title: 'UX Design Fundamentals - Interaction Design Foundation',
      description: 'Comprehensive course on user experience principles, user research, wireframing, and usability testing.',
      url: 'https://www.interaction-design.org/courses/user-experience-the-beginner-s-guide',
      type: 'course',
      domain: 'product-design',
      difficulty: 'Beginner',
    },
    {
      title: 'Design Systems 101',
      description: 'Building scalable design systems: component libraries, design tokens, documentation, and governance.',
      url: 'https://www.designsystems.com/101',
      type: 'article',
      domain: 'product-design',
      difficulty: 'Intermediate',
    },
  ];

  // Combine all resources
  const allResources = [
    ...softwareEngineeringResources,
    ...dataScienceResources,
    ...productDesignResources,
  ];

  // Insert all resources
  try {
    const insertedResources = await db.insert(resources).values(allResources).returning();
    
    console.log(`✅ Successfully seeded ${insertedResources.length} resources:`);
    console.log(`   - ${softwareEngineeringResources.length} Software Engineering resources`);
    console.log(`   - ${dataScienceResources.length} Data Science resources`);
    console.log(`   - ${productDesignResources.length} Product Design resources`);
    
    console.log('\n📚 Seeded resources:');
    insertedResources.forEach((resource) => {
      console.log(`   • ${resource.title} (${resource.domain} - ${resource.difficulty})`);
    });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('\n🎉 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });
