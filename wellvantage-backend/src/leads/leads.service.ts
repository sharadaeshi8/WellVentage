import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ILead } from './schemas/lead.schema';
import { QueryLeadsDto } from './dto/query-leads.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class LeadsService {
  constructor(@InjectModel('Lead') private leadModel: Model<ILead>) {}

  async create(createLeadDto: CreateLeadDto, gymId: string) {
    let {
      notes = [],
      status = {},
      preferences = {},
      ...leadData
    } = createLeadDto;
    const lead = new this.leadModel({
      ...leadData,
      gymId,
      status: {
        ...status,
        inquiryDate: status.inquiryDate
          ? new Date(status.inquiryDate)
          : new Date(),
        interestLevel: status.interestLevel || 'Cold',
        followUpStatus: status.followUpStatus || 'New Inquiry',
      },
      notes: (notes || []).map((note: { content: string; date?: string }) => ({
        content: note.content,
        date: new Date(note.date || Date.now()),
      })),
    });

    return lead.save();
  }

  async findAll(queryDto: QueryLeadsDto, gymId: string) {
    const {
      search,
      interestLevel,
      assignedTo,
      followUpStatus,
      createdAtFrom,
      createdAtTo,
      lastInteractionDate,
      isArchived = false,
      page = 1,
      limit = 10,
      sortBy = 'lastInteractionDate',
      sortOrder = 'desc',
    } = queryDto;

    const query: any = { gymId: new Types.ObjectId(gymId), isArchived };

    if (search) {
      const term = String(search).trim();
      if (term.length > 0) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const rx = new RegExp(escaped, 'i');
        // Only search in firstName and lastName, case-insensitive, partial match
        query.$or = [{ firstName: rx }, { lastName: rx }];
      }
    }
    if (interestLevel) {
      const norm = (v: string) =>
        v === 'high'
          ? 'Hot'
          : v === 'medium'
            ? 'Warm'
            : v === 'low'
              ? 'Cold'
              : v;
      query['status.interestLevel'] = norm(interestLevel as string);
    }
    // if (assignedTo) query['status.assignedTo'] = new Types.ObjectId(assignedTo);
    if (followUpStatus) query['status.followUpStatus'] = followUpStatus;

    // Exact-day filter for last interaction takes precedence
    if (lastInteractionDate) {
      // Build date in local time from yyyy-mm-dd string to avoid UTC parsing drift
      const [y, m, d] = lastInteractionDate.split('-').map((v) => Number(v));
      const start = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
      const end = new Date(y, (m || 1) - 1, d || 1, 23, 59, 59, 999);
      query.lastInteractionDate = { $gte: start, $lte: end };
    } else if (createdAtFrom || createdAtTo) {
      // Fallback to createdAt range if provided
      const createdAtRange: { $gte?: Date; $lte?: Date } = {};
      if (createdAtFrom) createdAtRange.$gte = new Date(createdAtFrom);
      if (createdAtTo) createdAtRange.$lte = new Date(createdAtTo);
      query.createdAt = createdAtRange;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'desc' ? -1 : 1,
    };

    const [leads, total] = await Promise.all([
      this.leadModel
        .find(query)
        .populate('firstName lastName')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.leadModel.countDocuments(query),
    ]);

    return {
      data: leads,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string) {
    const lead = await this.leadModel
      .findById(id)
      .populate('firstName lastName')
      .populate('firstName lastName')
      .exec();
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto) {
    const lead = await this.leadModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async updatePreferences(id: string, preferences: UpdatePreferencesDto) {
    // Build update object with dot notation to update only provided fields
    const updateFields: Record<string, unknown> = {};

    if (preferences.activityLevel !== undefined) {
      updateFields['preferences.activityLevel'] = preferences.activityLevel;
    }
    if (preferences.wellnessGoals !== undefined) {
      updateFields['preferences.wellnessGoals'] = preferences.wellnessGoals;
    }
    if (preferences.primaryFitnessFocus !== undefined) {
      updateFields['preferences.primaryFitnessFocus'] =
        preferences.primaryFitnessFocus;
    }
    if (preferences.preferredGymTime !== undefined) {
      updateFields['preferences.preferredGymTime'] =
        preferences.preferredGymTime;
    }
    if (preferences.preferredWorkoutIntensity !== undefined) {
      updateFields['preferences.preferredWorkoutIntensity'] =
        preferences.preferredWorkoutIntensity;
    }
    if (preferences.medicalConcerns !== undefined) {
      updateFields['preferences.medicalConcerns'] = preferences.medicalConcerns;
    }
    if (preferences.medicalConcernsOther !== undefined) {
      updateFields['preferences.medicalConcernsOther'] =
        preferences.medicalConcernsOther;
    }
    if (preferences.previousGymExperience !== undefined) {
      updateFields['preferences.previousGymExperience'] =
        preferences.previousGymExperience;
    }

    const lead = await this.leadModel
      .findByIdAndUpdate(id, { $set: updateFields }, { new: true })
      .exec();

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async updateStatus(id: string, status: UpdateStatusDto) {
    const lead = await this.leadModel
      .findByIdAndUpdate(
        id,
        { $set: { status, lastInteractionDate: new Date() } },
        { new: true },
      )
      .exec();
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async remove(id: string) {
    return this.leadModel.findByIdAndDelete(id).exec();
  }

  async archive(id: string, value: boolean) {
    const lead = await this.leadModel
      .findByIdAndUpdate(id, { $set: { isArchived: value } }, { new: true })
      .exec();
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async addNote(leadId: string, noteDto: CreateNoteDto, userId: string) {
    return this.leadModel
      .findByIdAndUpdate(
        leadId,
        {
          $push: {
            notes: {
              ...noteDto,
              date: new Date(),
            },
          },
          $set: { lastInteractionDate: new Date() },
        },
        { new: true },
      )
      .populate('firstName lastName');
  }

  async updateNote(leadId: string, noteId: string, content: string) {
    const lead = await this.leadModel.findOneAndUpdate(
      { _id: leadId, 'notes._id': noteId },
      { $set: { 'notes.$.content': content } },
      { new: true },
    );
    if (!lead) throw new NotFoundException('Note not found');
    return lead;
  }

  async deleteNote(leadId: string, noteId: string) {
    return this.leadModel.findByIdAndUpdate(
      leadId,
      { $pull: { notes: { _id: new Types.ObjectId(noteId) } } },
      { new: true },
    );
  }

  async bulkArchive(ids: string[], isArchived: boolean) {
    await this.leadModel.updateMany(
      { _id: { $in: ids.map((i) => new Types.ObjectId(i)) } },
      { $set: { isArchived } },
    );
    return { updated: ids.length };
  }

  // async bulkAssign(ids: string[], userId: string) {
  //   await this.leadModel.updateMany(
  //     { _id: { $in: ids.map((i) => new Types.ObjectId(i)) } },
  //     { $set: { 'status.assignedTo': new Types.ObjectId(userId) } },
  //   );
  //   return { updated: ids.length };
  // }

  async bulkDelete(ids: string[]) {
    const res = await this.leadModel.deleteMany({
      _id: { $in: ids.map((i) => new Types.ObjectId(i)) },
    });
    return { deleted: res.deletedCount };
  }
}
