import { Controller, Get, Injectable } from '@nestjs/common';
import { ClientService } from '../Services/client.srv';

@Controller('api/client')
@Injectable()
export class ClientController {
  constructor(private srv: ClientService) {}

  @Get()
  public async GetAll() {
    return this.srv.getAll();
  }
}
