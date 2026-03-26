import amqp from 'amqplib';

const runProducer = async (): Promise<void> => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const sendMessage = async (queue: string, message: string): Promise<void> => {
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    // console.log(`Message sent to ${queue}: ${message}`);
  };

  const sendNotification = async (
    queue: string,
    payload: unknown
  ): Promise<void> => {
    const message = JSON.stringify(payload);
    await sendMessage(queue, message);
  };

  // Example usage
  const emailPayload = {
    to: 'receiver@example.com',
    from: 'sender@example.com',
    subject: 'Sample Email',
    body: 'This is a sample email notification'
  };
  await sendNotification('email-queue', emailPayload);

  const smsPayload = {
    phoneNumber: '1234567890',
    message: 'This is a sample SMS notification'
  };
  await sendNotification('sms-queue', smsPayload);

  await channel.close();
  await connection.close();
};

runProducer().then(() => {
  // console.log('Producer finished sending messages.');
});
// .catch((error) => {
//   // console.error('Failed to run RabbitMQ producer', error);
// });
