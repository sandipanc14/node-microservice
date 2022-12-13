const kafka = require('kafka-node');
const logger = require('../../config/logger.config');
const appConfig = require('../../config/app.config');
appConfig.config();

var Producer = kafka.Producer,
  client = new kafka.KafkaClient(
    { kafkaHost: process.env.KAFKA_HOST_URL },
    {
      rejectUnauthorized: false,
    }
  ),
  producer = new Producer(client);

producer.on('ready', function () {
  logger.info('Producer is ready');
});

producer.on('error', function (err) {
  logger.error('Producer is in error state');
  logger.log(err);
});

const produce = async (topic, message) => {
  appConfig.config();
  if (!isAllowedProducer()) return;
  try {
    var sentMessage = JSON.stringify(message);
    payloads = [{ topic: topic, messages: sentMessage, partition: 0 }];
    producer.send(payloads, function (err, data) {
      logger.info(`Produced message in kafka --> ${JSON.stringify(data)}`);
    });
  } catch (error) {
    logger.error('Producer error-->', error);
  }
};

const isAllowedProducer = () => {
  if (
    ['PRODUCER', 'BOTH']
      .map((i) => i.toUpperCase())
      .includes(
        process.env.KAFKA_PRODUCER_OR_CONSUMER
          ? process.env.KAFKA_PRODUCER_OR_CONSUMER.toUpperCase()
          : process.env.KAFKA_PRODUCER_OR_CONSUMER
      )
  ) {
    return true;
  }
  return false;
};

module.exports = { produce };
