
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Campaign } from './modules/campaigns/entities/campaign.entity';
import { User } from './modules/users/entities/user.entity';
import { CampaignStatus } from './common/enums/status.enum';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const campaignRepo = dataSource.getRepository(Campaign);
  const userRepo = dataSource.getRepository(User);

  // Find a user to assign as creator (preferably ADMIN or NGO)
  const user = await userRepo.findOne({ where: {} }); // Just get the first user for simplicity

  if (!user) {
    console.error('No user found to assign campaigns to. Please create a user first.');
    await app.close();
    process.exit(1);
  }

  console.log(`Assigning campaigns to user: ${user.name} (${user.email})`);

  const campaigns = [
    {
      title: 'Emergency Food Relief for Flood Victims',
      description: 'Thousands of families have been displaced by recent floods. We are providing immediate food assistance including rice, oil, and clean water to survival. Your support can save lives.',
      goalAmount: 50000,
      raisedAmount: 12500,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
      image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&q=80&w=2070',
      createdBy: user,
      isEmergency: true,
      status: CampaignStatus.ACTIVE,
      donorsCount: 45,
    },
    {
      title: 'Build a School in Rural Village',
      description: 'Education is the key to breaking the cycle of poverty. We are building a primary school for 200 children who currently have no access to education. Join us in building a brighter future.',
      goalAmount: 75000,
      raisedAmount: 25000,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2070',
      createdBy: user,
      isEmergency: false,
      status: CampaignStatus.ACTIVE,
      donorsCount: 120,
    },
    {
      title: 'Clean Water Project',
      description: 'Providing clean and safe drinking water to communities suffering from waterborne diseases. We are installing deep wells and water filtration systems.',
      goalAmount: 15000,
      raisedAmount: 8900,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 45)),
      image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=2069',
      createdBy: user,
      isEmergency: false,
      status: CampaignStatus.ACTIVE,
      donorsCount: 67,
    },
    {
      title: 'Medical Aid for Children',
      description: 'Providing life-saving surgeries and medical treatments for children in conflict zones. No child should suffer from treatable conditions due to lack of resources.',
      goalAmount: 100000,
      raisedAmount: 55000,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 90)),
      image: 'https://images.unsplash.com/photo-1519823551278-64ac927ac280?auto=format&fit=crop&q=80&w=2070',
      createdBy: user,
      isEmergency: true,
      status: CampaignStatus.ACTIVE,
      donorsCount: 230,
    },
    {
      title: 'Winter Warmth Drive',
      description: 'Helping vulnerable families survive the harsh winter by distributing blankets, warm clothing, and heaters. A small donation can keep a family warm this season.',
      goalAmount: 20000,
      raisedAmount: 5000,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 20)),
      image: 'https://images.unsplash.com/photo-1487149506474-cbf7196aca20?auto=format&fit=crop&q=80&w=2071',
      createdBy: user,
      isEmergency: false,
      status: CampaignStatus.ACTIVE,
      donorsCount: 30,
    }
  ];

  for (const campaignData of campaigns) {
    const campaign = campaignRepo.create(campaignData);
    await campaignRepo.save(campaign);
    console.log(`Created campaign: ${campaign.title}`);
  }

  console.log('Seeding completed successfully!');
  await app.close();
}

bootstrap();
