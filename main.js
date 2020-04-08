require('dotenv').config();

const express = require('express');
const cors = require('cors');
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');

const app = express();
app.use(express.json());
app.use(cors());

const s3 = new AWS.S3({
  accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
});

const BUCKET = process.env.APP_AWS_S3_BUCKET;
const PORT = process.env.APP_PORT;

app.get('/', function (req, res) {
  res.send('Hello World!!');
});

app.get('/get-objects', function (req, res) {
  var params = { Bucket: BUCKET };
  s3.listObjects(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
      res.send(data);
    }
  });
});

app.post('/get-presigned-url', function (req, res) {
  const { fileName, fileType } = req.body;
  const key = `${uuid()}_${fileName}`;
  const params = {
    Bucket: BUCKET,
    Key: key,
    ContentType: fileType,
    Expires: 600,
  };
  const url = s3.getSignedUrl('putObject', params);
  res.send({ key, url });
});

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}!`);
});
