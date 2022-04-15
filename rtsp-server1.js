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
var testtt = 0
app.post('/log', function (req, res) {
    const id = JSON.parse(req.body)
    var data = '[ERROR][' + mToday() + ']:video is not working' + id.name;
    console.log(data)
    saveLogData(data)
    testtt++
    res.send({
        success: true,
    })
});
const getSpotsData = () => {
    const jsonData = fs.readFileSync('./config.json')
    // console.log(JSON.parse(jsonData))
    return JSON.parse(jsonData)
}
const saveLogData = (content) => {
    const path = './log.txt'
    try {
        if (!fs.existsSync(path)) {
            fs.writeFile(path, '', function (error) {
                console.log(error)
                console.log('create log.txt')
            })
        }
    } catch (err) {
        console.error(err)
    }
    var data = fs.readFileSync(path).toString().split("\n");
    data.splice(-1, 0, content);
    var text = data.join("\n");
    fs.writeFile(path, text, function (err) {
        if (err) return console.log(err);
    });
}

function mToday() {
    var m = new Date().toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei'
    });
    return m;
}