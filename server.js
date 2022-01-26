//server.js
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(favicon(__dirname + './build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/ping', function (req, res) {
 return res.send('Server up and running in ' + process.env.NODE_ENV + 'environment!');
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(process.env.PORT || 8080);