#!/usr/bin/env node
const axios = require('axios');
const amqp = require('amqplib/callback_api');

var q_order = 'order';
var q_complete = 'request_complet';
var msg_count = 0;
var flag = 0;

amqp.connect(
  'amqp://localhost',
  function(err, conn) {
    if (err) {
      throw new Error(err);
    }
    conn.createChannel(function(err, ch) {
      if (err) {
        throw new Error(err);
      }
      console.log(
        ' [*] Waiting for order and completed messages. To exit press CTRL+C'
      );

      //setting the maximum number of messages sent over the channel
      //that can be awaiting acknowledgement;
      ch.prefetch(1);

      ch.consume(q_order, function(msg) {
        if (msg !== null) {
          var message = JSON.parse(msg.content.toString());
          var order = message.payload;
          console.log(' [%d] New order placed, start flow.', msg_count, order);
          msg_count++;
          ch.ack(msg);
          axios({
            method: 'post',
            url: 'http://localhost:8080/engine-rest/message',
            data: {
              messageName: 'OrderPlacedEvent',
              businessKey: message.businessKey,
              processVariables: {
                orderId: { value: order.orderId, type: 'String' },
                uid: { value: order.uid, type: 'String' },
                profiles: { value: order.profiles, type: 'String' },
                desc: { value: order.desc, type: 'String' },
              },
            },
          })
            .then(function(response) {
              console.log(
                ' corellation with order message resp status: ',
                response.status
              );
            })
            .catch(function(err) {
              console.log('Error', err);
            });
        }
      });

      ch.consume(q_complete, async function(msg) {
        if (msg !== null) {
          var message = JSON.parse(msg.content.toString());
          var order = message.payload;

          console.log(
            " [%d] %s: '%s'",
            msg_count,
            msg.fields.routingKey,
            msg.content.toString()
          );
          msg_count++;

          var processVariables = {};
          processVariables[order.profile + '_Status'] = {
            value: order.status,
            type: 'String',
          };

          axios({
            method: 'post',
            url: 'http://localhost:8080/engine-rest/message',
            data: {
              messageName: 'RequestExecutedEvent',
              processInstanceId: message.trace_id,
              localCorrelationKeys: {
                MatchProfille: { value: order.profile, type: 'String' },
              },
              processVariables: processVariables,
            },
          })
            .then(function(response) {
              ch.ack(msg);
              console.log(
                ' Corellation completed message resp status: ',
                response.status
              );
            })
            .catch(function(err) {
              ch.ack(msg);
              console.log('Error correlation message\n', err.response.data);
            });
        }
      });
    });
  }
);
