#!/usr/bin/env node
const axios = require('axios');
const amqp = require('amqplib/callback_api');

var q_order = 'order';
var q_complete = 'request_complet';
var msg_count = 0;

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
      //ch.assertQueue(q_order);
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
      //ch.assertQueue(q_complete);
      ch.consume(q_complete, function(msg) {
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
          ch.ack(msg);
          axios({
            method: 'post',
            url: 'http://localhost:8080/engine-rest/message',
            data: {
              messageName: 'RequestExecutedEvent',
              processInstanceId: message.trace_id,
              processVariables: {
                status: { value: order.status, type: 'String' },
              },
            },
          })
            .then(function(response) {
              console.log(
                ' corellation completed message resp status: ',
                response.status
              );
            })
            .catch(function(err) {
              console.log('Error', err.response.data);
            });
        }
      });
    });
  }
);
