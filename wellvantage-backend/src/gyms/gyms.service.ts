import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IGym } from './schemas/gym.schema';

@Injectable()
export class GymsService {
  constructor(@InjectModel('Gym') private gymModel: Model<IGym>) {}

  async findById(id: string) {
    const gym = await this.gymModel.findById(id);
    if (!gym) throw new NotFoundException('Gym not found');
    return gym;
  }

  async update(id: string, data: Partial<IGym>) {
    const gym = await this.gymModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!gym) throw new NotFoundException('Gym not found');
    return gym;
  }

  async create(data: Partial<IGym>) {
    const gym = new this.gymModel(data);
    return gym.save();
  }
}
