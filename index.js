const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const fs = require('fs');
const osc = require('node-osc');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const oscClient = new osc.Client('127.0.0.1', '3334');

//const writeStream = fs.createWriteStream('bpmData.chan', {flags:'w'});
//console.log('Created new bpmData.chan file');

io.on('connection', (socket) => {
  console.log(socket.id + ' connected');
  oscClient.send('/status', socket.id + ' connected');

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected');
  });

  socket.on('estimate', (estimateObject) => {
    //console.log('received estimate', estimateObject);
    //socket.broadcast.emit('estimate', estimateObject);
    //writeStream.write(estimateObject.bpm+'\t'+estimateObject.time+'\t'+estimateObject.quality+'\t'+estimateObject.rank+'\t'+estimateObject.jitter+'\n');
    const toSend = estimateObject;//.bpm+'\t'+estimateObject.time+'\t'+estimateObject.quality+'\t'+estimateObject.rank+'\t'+estimateObject.jitter+'\n';
    oscClient.send([
      '/bpm', 
      estimateObject.bpm,
      estimateObject.time,
      estimateObject.quality,
      estimateObject.rank,
      estimateObject.jitter
    ]);
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
})
