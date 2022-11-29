import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeClientContract } from '../../entities/EmployeeClientContract';
import { Repository } from 'typeorm';
import { ProgramsReview } from '../../entities/ProgramsReview';
import { BatchStudent } from '../../entities/BatchStudent';

@Injectable()
export class AlumniService {
  constructor(
    @InjectRepository(EmployeeClientContract)
    private employee: Repository<EmployeeClientContract>,
    @InjectRepository(ProgramsReview)
    private review: Repository<ProgramsReview>,
    @InjectRepository(BatchStudent) private batchst: Repository<BatchStudent>,
  ) {}

  public async getSuccessStory() {
    return await this.employee.find({
      relations: {
        eccoEntity: { empEntity: true, empJoro: true },
        eccoJoty: true,
        eccoClit: true,
      },
      order: {
        eccoModifiedDate: 'DESC',
      },
    });
  }

  public async getTestimony() {
    return await this.review.find({
      relations: {
        poreProg: true,
        poreEntity: true,
      },
      order: {
        boreModifiedDate: 'desc',
      },
    });
  }

  // public async getBatchAlumni() {
  //   return await this.batchst.find({
  // relations: {
  //   eccoEntity: {
  //     empEntity: { batchStudents: { bastBatch: { batchProg: true } } },
  //   },
  //   eccoClit: true,
  // },
  // relations: {
  //   bastBatch: { batchProg: true },
  //   bastEntity: {  }
  // },
  // order: {
  //   eccoModifiedDate: 'DESC',
  // },
  //   });
  // }
}
