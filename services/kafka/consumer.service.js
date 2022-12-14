const kafka = require('kafka-node');
const fs = require('fs');
const appRoot = require('app-root-path');
const logger = require('../../config/logger.config');
const appConfig = require('../../config/app.config');

const consume = async (topicNames) => {
  appConfig.config();
  if (!isAllowedConsumer()) {
    global.isConsumerConnected = false;
    return;
  }
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
        autoCommit: true,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        encoding: 'utf8',
        fromOffset: false, // make it true to start fetching from the specified offset for the topics
      }));

    global.isConsumerConnected = true;

    consumer.on('message', function (message) {
      if (!isAllowedConsumer()) {
        consumer.close(() => {
          global.isConsumerConnected = false;
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
      client.createTopics(topicNames, (err, res) => {
        if (res) {
          logger.info(`Topic(s): ${topicNames.join(',')} created...`);
          consume(topicNames);
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
