import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUser } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async findAll(filter: { gymId?: string; role?: string } = {}) {
    const q: any = {};
    if (filter.gymId) q.gymId = new Types.ObjectId(filter.gymId);
    if (filter.role) q.role = filter.role;
    return this.userModel.find(q).lean();
  }

  async findById(id: string) {
    return this.userModel.findById(id);
  }

  async findByGoogleId(googleId: string) {
    return this.userModel.findOne({ googleId });
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(data: Partial<IUser>) {
    const u = new this.userModel(data);
    return u.save();
  }

  async update(id: string, data: Partial<IUser>) {
    return this.userModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async deactivate(id: string) {
    return this.userModel.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true });
  }
}
