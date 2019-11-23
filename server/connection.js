const ibmdb = require('ibm_db');
const express = require('express');
const cors = require('cors');
const Pool = ibmdb.Pool;
const pool = new Pool({ autoCleanIdle: true });
require('dotenv').config()

const app = express();

const PORT = process.env.PORT;
const db_conn_string = `DATABASE=${process.env.DB};HOSTNAME=${process.env.HOSTNAME};UID=${process.env.UID};PWD=${process.env.DB_PASSWORD};PORT=${process.env.DB_PORT};PROTOCOL=TCPIP`;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req,res) => {
  pool.open(db_conn_string, (err,conn) => {
    if (err) return res.send(err);
    const qry = 'select * from doctors;'; 
    conn.query(qry, (err, data) => {
      if (err) {
        res.send({ success: false, err });
      } else {
        res.send({ success: true, data });
      }

      conn.close(() => {
        console.log('done');
      });
    });
  });
});

app.post('/addClient', (req, res) => {
  pool.open(db_conn_string, function (err,conn) {
    if (err) return res.send(err);
    const {
      name,
      age,
      email,
      weight,
      phone
    } = req.body;
    console.log('Ready to add: ', name, age, email ,weight, phone)

    const qry = `insert into clients(name, age, email, weight, phone) values('${name}', '${age.toString()}', '${email}', '${weight.toString()}', '${phone}');`; 
    conn.query(qry, function (err, data) {
      if (err) {
        res.send({ success: false, error: err });
      } else {
        res.send({ success: true, data });     
      }

      conn.close(function () {
        console.log('done');
      });
    });
  });
});

app.get('/listClients', (req,res) => {
  pool.open(db_conn_string, (err,conn) => {
    if (err) return res.send(err);
    const qry = 'select NAME, AGE, WEIGHT, EMAIL, CREATED_AT from clients group by CREATED_AT, NAME, AGE, WEIGHT, EMAIL;'; 
    conn.query(qry, (err, data) => {
      if (err) {
        res.send({ success: false, err });
      } else {
        console.log('Listed: datais: ', data);
        res.send({ success: true, data });
      }
      conn.close(() => {
        console.log('done');
      });
    });
  });
});

app.get('/createDatesTable', (req, res) => {
  pool.open(db_conn_string, (err,conn) => {
    if (err) return res.send(err);
    const sql = `create table dates (created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, clientId INT NOT NULL, docId INT NOT NULL, primary key(clientId, docId), FOREIGN KEY (clientId) REFERENCES clients(clientId), FOREIGN KEY (docId) references users(uid));`;
    conn.query(sql, function (err, data) {
      if (err) {
        res.send({ success: false, err });
      } else {
        res.send({ success: true, data });
      }
      conn.close(() => {
        console.log('done', data);
      });
    });
  });
});

app.get('/listDates', (req, res) => {
  pool.open(db_conn_string, (err,conn) => {
    if (err) return res.send(err);
    const sql = `select * from dates;`;
    conn.query(sql, function (err, data) {
      if (err) {
        res.send({ success: false, err });
      } else {
        res.send({ success: true, data });
      }
      conn.close(() => {
        console.log('done', data);
      });
    });
  });
});

app.post('/createDate', (req, res) => {
  pool.open(db_conn_string, function (err,conn) {
    if (err) return res.send(err);
    const {
      clientId,
      docId
    } = req.body;
    console.log('Ready to add: ', created_at, clientId, docId)

    const qry = `insert into dates(clientId, docId) values(${clientId}, ${docId});`; 
    conn.query(qry, function (err, data) {
      if (err) {
        res.send({ success: false, error: err });
      } else {
        res.send({ success: true, data });     
      }

      conn.close(function () {
        console.log('done');
      });
    });
  });
});

app.post('/login', (req, res) => {
  pool.open(db_conn_string, function (err,conn) {
    if (err) return res.send(err);
    conn.query(`select name, password from users WHERE UPPER(name) LIKE UPPER('${req.body.email}');`, function (err, data) {
      if (err) {
        res.send({ success: false, error: err });
      } else {
        if (data[0] && data[0].PASSWORD === req.body.password) {
          res.send({ success: true, data: data[0].NAME});
        } else {
          res.send({ success: false, message: 'Contraseña incorrecta'});
        }        
      }

      conn.close(function () {
        console.log('done');
      });
    });
  });
});

app.post('/updateClient', (req, res) => {
  const client = req.body.client;
  if (!client) {
    res.status(400).send({ success: false, error: 'No client provided' });
  }
  pool.open(db_conn_string, function (err,conn) {
    console.log('Client is:', client);
    const qry = `UPDATE clients 
    SET 
      clientId = '${client.clientId}', 
      name = '${client.nombre}', 
      age = '${client.age}', 
      weight = '${client.weight}', 
      email = '${client.email}', 
      phone = '${client.phone}'
    WHERE clientId = '${client.clientId}';
      `; 
    conn.query(qry, function (err, data) {
      if (err) {
        res.send({ success: false, error: err });
      } else {
        res.send({ success: true, data });     
      }

      conn.close(function () {
        console.log('Done');
      });
    });
  });
});

app.post('/deleteClient', (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.status(400).send({ success: false, error: 'No client id provided' });
  }
  pool.open(db_conn_string, function (err,conn) {
    console.log('Client id is:', id);
    const qry = `DELETE from clients WHERE clientId = '${id}';`; 
    conn.query(qry, function (err, data) {
      if (err) {
        res.send({ success: false, error: err });
      } else {
        res.send({ success: true, data });     
      }

      conn.close(function () {
        console.log('Done');
      });
    });
  });
});

app.listen(PORT, () => {
  console.log('Server listening on port: ', PORT);
});