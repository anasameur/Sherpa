#!/usr/bin/env node
const amqp = require('amqplib/callback_api');

var q_sap_habilitation = 'sap_habilitation';
var q_gtf_habilitation = 'gtf_habilitation';

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
        ' [*] Waiting for habilitation request  messages. To exit press CTRL+C'
      );
      //ch.assertQueue(q_order);
      consumeMsg(ch,q_sap_habilitation)
      consumeMsg(ch,q_gtf_habilitation)
    });
  }
);

function consumeMsg(ch, q) {
  ch.consume(q, function(msg) {
    if (msg !== null) {
      var message = JSON.parse(msg.content.toString());
      var order = message.payload;
      order.status = Math.random() > 0.5 ? 'KO' : 'OK';
      console.log(' [%s] Request was processed from queue %s', message.id,q);
      ch.ack(msg);
      var ex = 'habilitation-exchange';
      var messageToSend = message;
      messageToSend.payload = order;
      ch.publish(ex, 'complet', new Buffer(JSON.stringify(messageToSend)));
      console.log(
        ' [x] Sending message to RabbitMQ  %s',
        JSON.stringify(message)
      );
    }
  });
}
