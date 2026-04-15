import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Snippet, SnippetDocument } from './snippet.schema';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { GetSnippetsQueryDto } from './dto/get-snippets-query.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Injectable()
export class SnippetsService {
  constructor(
    @InjectModel(Snippet.name)
    private snippetModel: Model<SnippetDocument>,
  ) {}

  async create(dto: CreateSnippetDto) {
    return this.snippetModel.create(dto);
  }

  async findAll(query: GetSnippetsQueryDto) {
    const { page = '1', limit = '10', q, tag } = query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const filter: Record<string, any> = {};

    // 🔍 пошук
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    // 🏷️ фільтр по тегу
    if (tag) {
      filter.tags = tag;
    }

    const skip = (pageNum - 1) * limitNum;

    const data = await this.snippetModel
      .find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await this.snippetModel.countDocuments(filter);

    return {
      data,
      total,
      page: Number(page),
      pages: Math.ceil(total / limitNum),
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid ID');
    }

    const snippet = await this.snippetModel.findById(id);

    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    return snippet;
  }

  async update(id: string, dto: UpdateSnippetDto) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid ID');
    }

    const updated = await this.snippetModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Snippet not found');
    }

    return updated;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid ID');
    }

    const deleted = await this.snippetModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Snippet not found');
    }

    return {
      message: 'Snippet deleted successfully',
    };
  }
}
