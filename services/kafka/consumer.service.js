const kafka = require('kafka-node');
const fs = require('fs');
const appRoot = require('app-root-path');
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
        if (message.topic === topicData.topic) {
          var writerStream = fs.createWriteStream(
            `${appRoot}/volumes/output/${topicData.topic}.dat`,
            {
              flags: 'a',
            }
          );
          writerStream.write(JSON.stringify(message) + '\r\n', 'UTF8');
          writerStream.on('error', function (err) {
            logger.error(err.stack);
          });
        }
      });
    });

    consumer.on('error', function (err) {
      logger.error('Error:', err);
      client.createTopics(topics, (err, res) => {
        if (res) {
          logger.info(`Topic(s): ${topicNames.join(',')} created...`);
        } else {
          logger.error('Error in adding topic: ', err);
        }
      });
    });

    consumer.on('offsetOutOfRange', function (err) {
      logger.error('offsetOutOfRange:', err);
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
