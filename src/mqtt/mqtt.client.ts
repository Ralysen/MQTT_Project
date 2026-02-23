import mqtt, { type MqttClient } from 'mqtt';
import pino from 'pino';

const logger = pino({ name: 'mqtt' });

export function createMqttClient(): MqttClient {
  const host = process.env['MQTT_HOST'] ?? 'localhost';
  const port = process.env['MQTT_PORT'] ?? '1883';
  const username = process.env['MQTT_USERNAME'];
  const password = process.env['MQTT_PASSWORD'];

  const client = mqtt.connect(`mqtt://${host}:${port}`, {
    ...(username !== undefined && { username }),
    ...(password !== undefined && { password }),
    reconnectPeriod: 5000,
    connectTimeout: 10000,
  });

  client.on('connect', () => {
    logger.info({ host, port }, 'Connected to MQTT broker');
  });

  client.on('reconnect', () => {
    logger.warn('Reconnecting to MQTT broker...');
  });

  client.on('error', (err) => {
    logger.error({ err }, 'MQTT error');
  });

  client.on('offline', () => {
    logger.warn('MQTT client offline');
  });

  return client;
}
