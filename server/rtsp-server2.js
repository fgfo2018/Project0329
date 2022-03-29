var config = require('../config');
const app = require('express')(),
    server = require('http').Server(app),
    io = require('socket.io')(config.server02_Port, {
        cors: {
            // No CORS at all
            origin: '*',
        }
    });
rtsp = require('rtsp-ffmpeg');
var uri = config.server02_Url,
    stream = new rtsp.FFMpeg({
        input: uri,
        rate: config.server02_VIDEO_FPS
    });
stream.cmd = '.\\ffmpeg\\bin\\ffmpeg.exe';
io.on('connection', function (socket) {
    var pipeStream = function (data) {
        socket.emit('data', data.toString('base64'));
    };
    stream.on('data', pipeStream);
    socket.on('disconnect', function () {
        stream.removeListener('data', pipeStream);
    });
});
// server.listen(3000, function () {
// console.log('listening on *:3000');
// });
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
    // var port = server.address().port;
    console.log("rtps輸出");
});