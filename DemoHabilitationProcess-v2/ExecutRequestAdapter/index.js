const { Client, Variables } = require('camunda-external-task-client-js');
const uuid = require('uuid/v1');
const amqp = require('amqplib/callback_api');

// configuration for the Client:
//  - 'baseUrl': url to the Workflow Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: 'http://localhost:8080/engine-rest' };

// create a Client instance with custom configuration
const client = new Client(config);
client.subscribe('HabilitationJob', async function({ task, taskService }) {
  console.log(
    ' [%] Worker start succesefuly and subscribe to HabilitationJob Topic\n'
  );

  const profiles = task.variables.get('profiles').split(',');

  // set a process variable 'habilitationNumber'
  const processVariables = new Variables();
  processVariables.set('habilitationNumber', profiles.length);
  processVariables.set('profiles', profiles);

  const id = uuid(); // unique id of this message
  const trace_id = task.processInstanceId; // get the process instance id
  const sender = 'Order | Camunda';
  const timestamp = new Date();

  profiles.forEach((element) => {
    const routingKey = element.split('_')[0]; // rabbitMQ routingKey
    var payload = {
      uid: task.variables.get('uid'),
      profile: element,
      orderId: task.variables.get('orderId'),
    };
    const message = {
      id: id,
      trace_id: trace_id,
      sender: sender,
      timestamp: timestamp,
      payload: payload,
    };

    // Sending message to rabbitMQ
    amqp.connect(
      'amqp://localhost',
      function(err, conn) {
        conn.createChannel(function(err, ch) {
          var ex = 'habilitation-exchange';

          ch.publish(ex, routingKey, new Buffer(JSON.stringify(message)));
          console.log('Routing KEY %s', routingKey);
          console.log(
            ' [x] Sending message to RabbitMQ  %s',
            JSON.stringify(message)
          );
        });

        setTimeout(function() {
          conn.close();
        }, 500);
      }
    );
  });

  // complete the task
  await taskService.complete(task, processVariables);
});
