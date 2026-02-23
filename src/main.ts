import 'reflect-metadata';
import * as dotenv from 'dotenv';
import pino from 'pino';
import { AppDataSource } from './database/data-source';
import { createMqttClient } from './mqtt/mqtt.client';
import { DeviceService } from './services/device.service';
import { LocalisationService } from './services/localisation.service';
import { createLocationHandler } from './mqtt/location.handler';

dotenv.config();

const logger = pino({ name: 'app' });
const LOCATION_TOPIC = 'devices/+/location';

async function main(): Promise<void> {
  await AppDataSource.initialize();
  logger.info('Database connected');

  const deviceService = new DeviceService(AppDataSource);
  const localisationService = new LocalisationService(AppDataSource);
  const locationHandler = createLocationHandler(deviceService, localisationService);

  const mqttClient = createMqttClient();

  mqttClient.on('connect', () => {
    mqttClient.subscribe(LOCATION_TOPIC, (err) => {
      if (err) {
        logger.error({ err }, `Failed to subscribe to ${LOCATION_TOPIC}`);
      } else {
        logger.info(`Subscribed to ${LOCATION_TOPIC}`);
      }
    });
  });

  mqttClient.on('message', (topic, message) => {
    void locationHandler(topic, message);
  });

  process.on('SIGTERM', async () => {
    logger.info('Shutting down...');
    mqttClient.end();
    await AppDataSource.destroy();
    process.exit(0);
  });
}

main().catch((err) => {
  logger.error({ err }, 'Fatal error');
  process.exit(1);
});
