/* eslint-disable no-console */
import mongoose, { Schema, Types } from 'mongoose';
import { LeadSchema } from '../leads/schemas/lead.schema';
import { GymSchema } from '../gyms/schemas/gym.schema';
import { UserSchema } from '../users/schemas/user.schema';

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function chance(pct: number) {
  return Math.random() < pct;
}

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wellvantage';
  const countArg = Number(process.argv.find((a) => a.startsWith('--count='))?.split('=')[1] || 50);
  const count = Math.min(Math.max(countArg, 1), 200);

  await mongoose.connect(uri);

  const Gym = mongoose.model('Gym', GymSchema);
  const User = mongoose.model('User', UserSchema);
  const Lead = mongoose.model('Lead', LeadSchema);

  // Ensure a gym exists (or create one)
  let gym: any = await Gym.findOne();
  if (!gym) {
    gym = await new Gym({
      name: 'Seed Gym',
      ownerFirstName: 'Owner',
      ownerLastName: 'Seed',
      addressLine1: '123 Seed St',
      city: 'Seedtown',
      state: 'CA',
      country: 'US',
      phone: '9999999999',
      phoneVerified: false,
    }).save();
  }

  // Ensure some users for assignment
  let users: any[] = await User.find({ gymId: gym._id }).limit(5);
  if (users.length < 3) {
    const toCreate = 3 - users.length;
    const newOnes: any[] = await User.insertMany(
      Array.from({ length: toCreate }).map((_, i) => ({
        email: `seeduser${Date.now()}_${i}@example.com`,
        googleId: `${Date.now()}_${i}`,
        firstName: ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey'][i % 5],
        lastName: ['Lee', 'Patel', 'Garcia', 'Kim', 'Singh'][i % 5],
        gymId: gym._id as Types.ObjectId,
        role: 'admin',
      })) as any,
    );
    users = [...users, ...newOnes];
  }

  // Create leads
  const firstNames = ['John', 'Jane', 'Mike', 'Sara', 'Chris', 'Priya', 'Amit', 'Nina'];
  const lastNames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Khan', 'Patel', 'Sharma', 'Singh'];
  const domains = ['example.com', 'mail.com', 'test.io'];

  const docs = Array.from({ length: count }).map((_, i) => {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const phone = `9${randInt(100000000, 999999999)}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 999)}@${pick(domains)}`;
    const gender = pick(['Male', 'Female', 'Non binary/Other']);
    const height = chance(0.7) ? randInt(150, 190) : undefined;
    const weight = chance(0.7) ? randInt(50, 100) : undefined;
    const assigned = chance(0.6) ? pick(users)._id : undefined;
    const interest = pick(['Hot', 'Warm', 'Cold']);
    const followUp = pick([
      'New Inquiry',
      'Fresh lead, contacted once',
      'Needs Follow-Up',
      'Contacted but no recent response',
      'Engaged',
      'Actively talking or interested',
      'Converted',
      'Signed up',
      'Archived',
    ]);
    const createdAt = new Date(Date.now() - randInt(0, 60) * 24 * 60 * 60 * 1000);
    const lastInteractionDate = new Date(createdAt.getTime() + randInt(0, 30) * 24 * 60 * 60 * 1000);

    return {
      firstName,
      lastName,
      phone,
      email,
      gender,
      height,
      weight,
      gymId: gym._id as Types.ObjectId,
      status: {
        inquiryDate: createdAt,
        assignedTo: assigned,
        interestLevel: interest,
        followUpStatus: followUp,
      },
      preferences: {},
      isArchived: false,
      lastInteractionDate,
      createdAt,
      updatedAt: new Date(),
    } as any;
  });

  const res = await Lead.insertMany(docs);
  console.log(`Seeded ${res.length} leads (gym=${String(gym._id)})`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
