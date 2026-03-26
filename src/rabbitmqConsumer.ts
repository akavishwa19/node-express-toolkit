import amqp from 'amqplib';
import logger from './utils/logger';

const runConsumer = async (): Promise<void> => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const handleMessage =
    (queue: string) =>
    async (message: amqp.ConsumeMessage | null): Promise<void> => {
      if (message) {
        // console.log(
        //   `Received message from ${queue}: ${message.content.toString()}`
        // );
        const parsedMessage = JSON.parse(message.content.toString());
        logger.info(parsedMessage);

        if (queue === 'email-queue') {
          //   console.log('Handling email notification:', parsedMessage);
        } else if (queue === 'sms-queue') {
          //   console.log('Handling SMS notification:', parsedMessage);
        } else {
          //   console.log('Unknown queue:', queue);
        }

        channel.ack(message);
      }
    };

  // Subscribing to email-queue
  await channel.assertQueue('email-queue', { durable: true });
  await channel.consume('email-queue', handleMessage('email-queue'));

  // Subscribing to sms-queue
  await channel.assertQueue('sms-queue', { durable: true });
  await channel.consume('sms-queue', handleMessage('sms-queue'));

  //   console.log('Consumer is subscribed to queues: email-queue, sms-queue');
};

runConsumer().then(() => {
  // console.log('Consumer is running...');
});
