import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import type { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private readonly repo: Repository<UserPreference>,
  ) {}

  async findByUser(userId: string): Promise<UserPreference> {
    const prefs = await this.repo.findOne({ where: { user_id: userId } });
    if (prefs) return prefs;

    // Return in-memory defaults — no row written until the user saves.
    return this.repo.create({ user_id: userId });
  }

  async upsert(userId: string, dto: UpdatePreferencesDto): Promise<UserPreference> {
    // Insert or update — conflict resolved on the primary key (user_id).
    await this.repo.upsert(
      { user_id: userId, ...dto },
      { conflictPaths: ['user_id'], skipUpdateIfNoValuesChanged: true },
    );
    return this.findByUser(userId);
  }
}
