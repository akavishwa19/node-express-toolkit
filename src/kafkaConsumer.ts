import { Kafka } from 'kafkajs';
import logger from './utils/logger';

if (!process.env.KAFKA_BROKER || !process.env.KAFKA_CONSUMER_GROUP_ID) {
  throw new Error('Kafka env variables missing');
}

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKER],
  retry: {
    initialRetryTime: 300,
    retries: 10
  }
});

const consumer = kafka.consumer({
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID
});

const connectConsumer = async () => {
  try {
    await consumer.connect();
    logger.info('Connected to kafka broker succesfully');
  } catch (error) {
    logger.error(error, 'Error while connecting to kafka broker');
    throw error;
  }
};

const listenToTopic = async (topic: string) => {
  await consumer.subscribe({ topic: topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      logger.info({ topic, partition, message }, 'recieved message from kafka');
    }
  });
};

const disconnectConsumer = async () => {
  try {
    await consumer.disconnect();
    logger.info('Disconnected to Kafka Broker succesfully');
  } catch (error) {
    logger.error(error, 'Error while disconnecting to kafka broker');
    throw error;
  }
};

export { connectConsumer, listenToTopic, disconnectConsumer };
