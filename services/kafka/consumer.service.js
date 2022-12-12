const kafka = require('kafka-node');
const fs = require('fs');
const logger = require('../../config/logger.config');

const consume = async (topicNames) => {
  if (!isAllowedConsumer()) return;
  try {
    const topics = topicNames.map((topic) => {
      return {
        topic: topic,
        offset: 0,
        partition: 0,
      };
    });
    (Consumer = kafka.Consumer),
      (client = new kafka.KafkaClient(
        {
          kafkaHost: process.env.KAFKA_HOST_URL,
        },
        {
          rejectUnauthorized: false,
        }
      )),
      (consumer = new Consumer(client, topics, {
        autoCommit: false,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8',
        fromOffset: true,
      }));

    consumer.on('message', function (message) {
      if (!isAllowedConsumer()) {
        consumer.close(() => {
          logger.info('Consumer disconnected.');
        });
        return;
      }

      topics.forEach((topicData) => {
        var writerStream = fs.createWriteStream(`${topicData.topic}.dat`, {
          flags: 'a',
        });
        writerStream.write(JSON.stringify(message) + '\r\n', 'UTF8');
        writerStream.on('error', function (err) {
          logger.error(err.stack);
        });
      });
    });

    consumer.on('error', function (err) {
      logger.error('Error:', err);
    });

    consumer.on('offsetOutOfRange', function (err) {
      logger.error('offsetOutOfRange:', err);
    });

    consumer.on('TopicsNotExistError', function (err) {
      console.log('hi', err);
    });
  } catch (error) {
    logger.error('Consumer error-->', error);
  }
};

const isAllowedConsumer = () => {
  if (
    ['CONSUMER', 'BOTH']
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

module.exports = { consume };