const express = require('express');
const cors = require('cors')
var fs = require("fs");
filename = "./config.json";
let rawdata = fs.readFileSync(filename);
let config = JSON.parse(rawdata);
const app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server, {
        cors: {
            // No CORS at all
            origin: '*',
        }
    }),
    rtsp = require('rtsp-ffmpeg');
const bodyParser = require('body-parser')

server.listen(config.server01_Port);
app.use(bodyParser.text({
        type: '*/*'
    }), express.static(__dirname + '/views'),
    cors()
);
var uri =
    config.server01_Url,
    stream = new rtsp.FFMpeg({
        input: uri,
        rate: config.server01_VIDEO_FPS
    });
io.on('connection', function (socket) {
    var pipeStream = function (data) {
        socket.emit('data', data.toString('base64'));
    };
    stream.on('data', pipeStream);
    socket.on('disconnect', function () {
        stream.removeListener('data', pipeStream);
    });

    console.log("[" + mToday() + "] NO.1 Connection succeeded")
});

function mToday() {
    var m = new Date().toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei'
    });
    return m;
}
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/config', function (req, res) {
    const output = getSpotsData();
    // console.log();
    res.send(output)
});

const getSpotsData = () => {
    const jsonData = fs.readFileSync('./config.json')
    // console.log(JSON.parse(jsonData))
    return JSON.parse(jsonData)
}