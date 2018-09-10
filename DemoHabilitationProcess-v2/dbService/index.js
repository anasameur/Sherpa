var express = require('express');
var config = require('./.config.json');
var bodyParser = require('body-parser');
var oracledb = require('oracledb');

//oracle database config
oracledb.autoCommit = true;

//set oracle database params
var db_user = config.oracledb.user;
var db_password = config.oracledb.password;
var db_connectString = config.oracledb.connectString;

// set server params.
var hostname = config.server.hostname;
var port = process.env.PORT || config.server.port;

// creat Express object.
var app = express();
app.set('trust proxy', true);

//use body parser to parse body param
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//allow cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// set route object
var myRouter = express.Router();

/* save Request to Sherpa DB */
myRouter.route('/api/v1/request').post(function(req, res) {
  if (!isValidSaveRequest(req, res)) {
    return; // stop execution of request and send error message
  }
  insertRequest(oracledb, req.body)
    .then(function(result) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ db_response: result }));
    })
    .catch(function(err) {
      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          error: {
            id: 'unable-to-save-request',
            message:
              'The request was received but we were unable to save it to our database.',
            ORA_ERR: err.message,
          },
        })
      );
    });
});

//set route variable to be used by app
app.use(myRouter);

// start server
app.listen(port, function() {
  console.log('Server %s start on port: ', hostname, port);
});

/* Utils */

// Request validation function

const isValidSaveRequest = (req, res) => {
  // Check the request body has at least a payload and uid.
  if (!req.body || !req.body.payload || !req.body.created_user_gid) {
    // Not a valid Request.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify({
        error: {
          id: 'Invalid Request',
          message: 'Request must have a payload and Uid.',
        },
      })
    );
    return false;
  }
  return true;
};

// Insert request function

function insertRequest(oracledb, request) {
  return new Promise(function(resolve, reject) {
    oracledb.getConnection(
      {
        user: db_user,
        password: db_password,
        connectString: db_connectString,
      },
      async function(err, connection) {
        if (err) {
          console.error('DataBase connection error', err.message);
          reject(err);
          return;
        }
        try {
          var user_id = await getUserIdFromGid(connection, request.payload.gid);
          var created_user = await getUserIdFromGid(
            connection,
            request.created_user_gid
          );
        } catch (error) {
          reject(error);
          return;
        }

        connection.execute(
          'INSERT INTO REQUEST (TYPE,USER_ID,CREATED_USER,STATUS,PAYLOAD) VALUES (:type,:user_id,:created_user,:status, :payload)',
          {
            type: 'DC',
            user_id: user_id,
            created_user: created_user,
            status: 'new',
            payload: JSON.stringify(request.payload),
          },
          function(err, result) {
            if (err) {
              doRelease(connection);
              reject(err);
            } else {
              console.log('Request added succesfuly');
              doRelease(connection);
              resolve(result);
            }
          }
        );
      }
    );
  });
}

// Get user Id from Gid function

function getUserIdFromGid(connection, gid) {
  return new Promise(function(resolve, reject) {
    connection.execute(
      'select id from "USER" where GID = :gid',
      { gid: gid },
      function(err, result) {
        if (err) {
          doRelease(connection);
          reject(err);
        } else {
          resolve(result.rows[0][0]);
        }
      }
    );
  });
}

//oracle database close connexion
function doRelease(connection) {
  connection.close(function(err) {
    if (err) console.error(err.message);
  });
}
