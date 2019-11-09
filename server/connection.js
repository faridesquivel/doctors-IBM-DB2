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

app.listen(PORT, () => {
  console.log('Server listening on port: ', PORT);
});