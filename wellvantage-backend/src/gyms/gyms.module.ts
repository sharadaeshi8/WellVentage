import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GymsService } from './gyms.service';
import { GymsController } from './gyms.controller';
import { GymSchema } from './schemas/gym.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Gym', schema: GymSchema }])],
  providers: [GymsService],
  controllers: [GymsController],
  exports: [GymsService],
})
export class GymsModule {}
