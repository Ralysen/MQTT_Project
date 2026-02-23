import { type DataSource } from 'typeorm';
import { Device } from '../models/device.entity';

export class DeviceService {
  private readonly repo;

  constructor(private readonly db: DataSource) {
    this.repo = db.getRepository(Device);
  }

  async findOrCreate(deviceId: string): Promise<Device> {
    let device = await this.repo.findOneBy({ deviceId });

    if (!device) {
      device = this.repo.create({ deviceId });
      await this.repo.save(device);
    }

    return device;
  }
}
