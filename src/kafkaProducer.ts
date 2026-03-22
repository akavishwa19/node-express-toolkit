import { Kafka, Partitioners } from 'kafkajs';
import logger from './utils/logger';

if (!process.env.KAFKA_BROKER) {
  throw new Error('Kafka env variables missing');
}

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});

const connectProducer = async () => {
  try {
    await producer.connect();
    logger.info('Connected to kafka broker succesfully');
  } catch (error) {
    logger.error(error, 'Error while connecting to kafka broker');
    throw error;
  }
};

const publishToTopic = async (topic: string, message: unknown) => {
  if (message == null) {
    logger.error('Kafka message not provided');
    throw new Error('Kafka message not provided');
  }
  let serialized: string;
  try {
    serialized = JSON.stringify(message);
  } catch (error) {
    logger.error({ error, message }, 'Failed to serialize Kafka message');
    throw error;
  }
  try {
    await producer.send({
      topic: topic,
      messages: [
        {
          value: serialized
        }
      ]
    });
    logger.info({ topic, message }, 'Kafka message published');
  } catch (error) {
    logger.error({ error, topic, message }, 'Kafka publish failed');
    throw error;
  }
};

const disconnectProducer = async () => {
  try {
    await producer.disconnect();
    logger.info('Disconnected to Kafka Broker succesfully');
  } catch (error) {
    logger.error(error, 'Error while disconnecting to kafka broker');
    throw error;
  }
};

export { connectProducer, publishToTopic, disconnectProducer };
