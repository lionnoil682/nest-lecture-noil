import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bldg } from './bldg.entity';

@Injectable()
export class BldgService {
  constructor(
    @InjectRepository(Bldg)
    private readonly bldgRepository: Repository<Bldg>,
  ) {}

  async findAll(): Promise<Bldg[]> {
    return this.bldgRepository.find();
  }

  async findNearby(x: number, y: number, radius: number): Promise<Bldg[]> {
    return this.bldgRepository
      .createQueryBuilder('bldg')
      .where(
        `ST_Distance(
        ST_setSRID(ST_MakePoint(bldg.x, bldg.y), 4326)::geography,
        bldg.blg_geom::geography
      ) <= :radius`,
        { x, y, radius },
      )
      .getMany();
  }
}
