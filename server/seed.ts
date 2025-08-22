import { db } from "./db";
import { articles } from "@shared/schema";

const realArticles = [
  {
    title: "The Rise of Remote Work: How Technology Changed the Workplace Forever",
    content: "The COVID-19 pandemic accelerated a workplace revolution that had been brewing for years. Companies across the globe were forced to adapt to remote work almost overnight. What started as a temporary emergency measure has now become a permanent fixture for many organizations. Studies show that 42% of the U.S. workforce now works from home full-time, and 82% work from home at least part of the time. This shift has profound implications for how we think about productivity, work-life balance, and corporate culture. Remote work has democratized access to opportunities, allowing people in rural areas or different countries to work for companies they never could have before. However, it also presents challenges in maintaining team cohesion and company culture.",
    summary: "The pandemic transformed remote work from a rare perk to a widespread business practice, creating both opportunities and challenges.",
    category: "technology",
    difficultyLevel: "B2",
    estimatedReadTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["remote work", "pandemic", "workplace", "technology"],
    culturalNotes: {
      "democratized": "In many cultures, access to opportunities is limited by geography - remote work breaks these barriers",
      "cohesion": "Different cultures have varying approaches to team unity - some prefer in-person interaction",
      "work-life balance": "This concept varies greatly across cultures - some prioritize family time, others career dedication"
    }
  },
  {
    title: "Understanding American Coffee Culture: More Than Just a Beverage",
    content: "Coffee in America is much more than a morning drink - it's a social institution. The average American drinks about 3 cups of coffee per day, and coffee shops have become informal meeting places for business, study, and socializing. This coffee culture has deep roots dating back to the Boston Tea Party when Americans rejected tea in favor of coffee as a patriotic act. Today, specialty coffee shops are neighborhood gathering places where people work on laptops, hold meetings, or catch up with friends. The rise of chains like Starbucks has standardized coffee culture across the country, creating a common vocabulary of sizes, flavors, and preparations that didn't exist 50 years ago.",
    summary: "American coffee culture extends beyond drinking coffee to encompass social interaction and community building.",
    category: "culture",
    difficultyLevel: "A2",
    estimatedReadTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["culture", "coffee", "social customs", "American lifestyle"],
    culturalNotes: {
      "institution": "In many Spanish-speaking countries, coffee culture centers around traditional cafés rather than modern coffee shops",
      "patriotic": "The connection between beverage choice and national identity is uniquely American",
      "gathering places": "In French culture, cafés serve a similar social function but with different etiquette and expectations"
    }
  },
  {
    title: "Sustainable Travel: How to Explore the World Responsibly",
    content: "As awareness of climate change grows, travelers are seeking ways to explore the world while minimizing their environmental impact. Sustainable travel involves making conscious choices about transportation, accommodation, and activities. Air travel accounts for about 2.5% of global carbon emissions, so many eco-conscious travelers are choosing to fly less frequently but stay longer at destinations. When they do fly, they purchase carbon offsets to neutralize their impact. Sustainable travelers also seek out eco-friendly accommodations that use renewable energy, reduce waste, and support local communities. They prefer to eat at locally-owned restaurants and buy from local artisans rather than large chains. This approach to travel not only reduces environmental impact but often provides more authentic cultural experiences.",
    summary: "Sustainable travel focuses on reducing environmental impact while supporting local communities and having authentic experiences.",
    category: "travel",
    difficultyLevel: "B1",
    estimatedReadTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["travel", "sustainability", "environment", "responsible tourism"],
    culturalNotes: {
      "conscious choices": "Environmental awareness varies by culture - some societies have longer traditions of conservation",
      "authentic": "What constitutes 'authentic' experience differs across cultures and personal backgrounds",
      "carbon offsets": "This concept is more familiar in developed countries where environmental education is widespread"
    }
  },
  {
    title: "The Psychology of Decision Making in Business Leadership",
    content: "Effective business leaders understand that decision-making is both an art and a science. Research in behavioral economics shows that humans are not purely rational decision-makers. We are influenced by cognitive biases, emotions, and social pressures. Successful leaders learn to recognize these influences and develop strategies to make better decisions. They gather diverse perspectives, question their assumptions, and use data to validate their intuitions. Great leaders also understand the importance of timing - knowing when to make quick decisions and when to take more time for deliberation. They create decision-making frameworks that can be applied consistently across different situations, reducing the mental energy required for routine choices while ensuring important decisions get the attention they deserve.",
    summary: "Effective business leadership requires understanding the psychological factors that influence decision-making and developing systematic approaches to improve choices.",
    category: "business",
    difficultyLevel: "C1",
    estimatedReadTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["business", "leadership", "psychology", "decision making"],
    culturalNotes: {
      "behavioral economics": "This field combines psychology and economics - more established in Western academic traditions",
      "diverse perspectives": "Collectivist cultures may naturally incorporate group input, while individualist cultures may rely more on personal judgment",
      "deliberation": "Different cultures have varying relationships with time and decision speed - some value quick action, others careful consideration"
    }
  },
  {
    title: "Breakthroughs in Renewable Energy: The Path to a Sustainable Future",
    content: "The renewable energy sector is experiencing unprecedented growth and innovation. Solar panel efficiency has improved dramatically while costs have plummeted by over 80% in the last decade. Wind energy now provides the cheapest electricity in many parts of the world. Energy storage technology, particularly lithium-ion batteries, has solved one of renewable energy's biggest challenges - providing power when the sun isn't shining or the wind isn't blowing. Smart grids are being developed to better manage the flow of renewable energy and reduce waste. Countries like Denmark now generate more than 100% of their electricity needs from wind power during peak periods. These advances are creating new jobs, reducing pollution, and offering hope for addressing climate change. However, the transition requires significant investment in infrastructure and workforce retraining.",
    summary: "Rapid advances in renewable energy technology are making clean power more affordable and reliable, driving a global energy transition.",
    category: "science",
    difficultyLevel: "B2",
    estimatedReadTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["renewable energy", "technology", "environment", "innovation"],
    culturalNotes: {
      "unprecedented": "The pace of technological change varies globally - some cultures are more adaptable to rapid change",
      "infrastructure": "Investment in large-scale projects requires different approaches in various political and economic systems",
      "workforce retraining": "Attitudes toward job change and learning new skills vary significantly across cultures"
    }
  },
  {
    title: "Digital Literacy in the Modern Workplace: Essential Skills for Success",
    content: "In today's rapidly evolving workplace, digital literacy has become as fundamental as traditional reading and writing skills. Employees at all levels need to understand not just how to use technology, but how to adapt to new digital tools and platforms. This includes basic computer skills, cloud computing, cybersecurity awareness, and data analysis. Many workers struggle with digital transformation in their organizations, feeling overwhelmed by constant technology updates. However, those who embrace continuous learning and develop strong digital skills often advance faster in their careers. Companies are investing heavily in digital training programs, recognizing that their workforce's technical competence directly impacts productivity and competitiveness. The key is developing a growth mindset and viewing technology as an enabler rather than a threat.",
    summary: "Digital literacy has become essential for workplace success, requiring continuous learning and adaptation to new technologies.",
    category: "technology",
    difficultyLevel: "A2",
    estimatedReadTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["digital literacy", "workplace skills", "technology", "career development"],
    culturalNotes: {
      "growth mindset": "This concept emphasizes learning from challenges - valued differently across educational cultures",
      "continuous learning": "Some cultures traditionally emphasize mastery of one skill, others value constant adaptation",
      "enabler": "Viewing technology as helpful rather than threatening varies by generation and cultural background"
    }
  }
];

export async function seedDatabase() {
  try {
    console.log("Seeding database with real articles...");
    
    for (const article of realArticles) {
      await db.insert(articles).values(article);
    }
    
    console.log(`Successfully seeded ${realArticles.length} articles to the database.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seeding immediately
seedDatabase().then(() => process.exit(0)).catch(error => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});