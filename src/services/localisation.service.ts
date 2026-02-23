import { type DataSource } from 'typeorm';
import { Localisation } from '../models/localisation.entity';
import { type Device } from '../models/device.entity';

export interface LocationPayload {
  lat: number;
  lon: number;
  alt?: number | null;
  recordedAt?: string | null;
}

export class LocalisationService {
  private readonly repo;

  constructor(private readonly db: DataSource) {
    this.repo = db.getRepository(Localisation);
  }

  async save(device: Device, payload: LocationPayload): Promise<void> {
    const localisation = new Localisation();
    localisation.device = device;
    localisation.latitude = payload.lat;
    localisation.longitude = payload.lon;
    localisation.altitude = payload.alt ?? null;
    localisation.recordedAt = payload.recordedAt ? new Date(payload.recordedAt) : new Date();

    await this.repo.save(localisation);
  }
}
