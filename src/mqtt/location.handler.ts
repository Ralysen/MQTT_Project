import pino from 'pino';
import { type DeviceService } from '../services/device.service';
import { type LocalisationService, type LocationPayload } from '../services/localisation.service';

const logger = pino({ name: 'location-handler' });

// Topic: devices/<device_id>/location
const TOPIC_PATTERN = /^devices\/([^/]+)\/location$/;

function parsePayload(raw: string): LocationPayload | null {
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;

    if (typeof data['lat'] !== 'number' || typeof data['lon'] !== 'number') {
      return null;
    }
    if (typeof data['recordedAt'] !== 'string') {
      return null;
    }

    return {
      lat: data['lat'],
      lon: data['lon'],
      alt: typeof data['alt'] === 'number' ? data['alt'] : null,
      recordedAt: data['recordedAt'],
    };
  } catch {
    return null;
  }
}

export function createLocationHandler(
  deviceService: DeviceService,
  localisationService: LocalisationService,
) {
  return async (topic: string, message: Buffer): Promise<void> => {
    const match = TOPIC_PATTERN.exec(topic);
    if (!match?.[1]) return;

    const deviceId = match[1];
    const payload = parsePayload(message.toString());

    if (!payload) {
      logger.warn({ topic }, 'Invalid payload, skipping');
      return;
    }

    try {
      const device = await deviceService.findOrCreate(deviceId);
      await localisationService.save(device, payload);
      logger.info({ deviceId, lat: payload.lat, lon: payload.lon }, 'Location saved');
    } catch (err) {
      logger.error({ err, deviceId, topic }, 'Failed to save location');
    }
  };
}
