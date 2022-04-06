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
    console.log("server open")
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

// 以下可以刪除
app.get('/api/data/initial', function (req, res) {
    const output = getSpotsData();
    // console.log();
    res.send(output)
});

app.post('/api/changed', function (req, res) {
    const SpotData = JSON.parse(req.body)
    console.log(SpotData);
    res.send(SpotData)
});

const getSpotsData = () => {
    const jsonData = fs.readFileSync('./test.json')
    // console.log(JSON.parse(jsonData))
    return JSON.parse(jsonData)
}
function defaultArray() {
    output = {
        "setting_atmospheric_temperature": 20.0,
        "setting_calibration": 0,
        "setting_colorbar_max": 500.0,
        "setting_colorbar_min": 0.0,
        "setting_export_camera_temperature": "C:\\THERMALDO\\export\\",
        "setting_export_image_video": "C:\\\\THERMALDO\\export",
        "setting_export_maximum_data": "C:\\TEST\\",
        "setting_external_optics_temperature": 20.0,
        "setting_external_optics_transmission": 0.95,
        "setting_first_alarm_temperature": 123.4,
        "setting_object_distance": 20.0,
        "setting_object_emissivity": 0.95,
        "setting_once_autofocus": 0,
        "setting_once_calibration": 0,
        "setting_pattern": 1,
        "setting_reflected_temperature": 20.0,
        "setting_relative_humidity": 0.9,
        "setting_sampling_rate": 10,
        "setting_second_alarm_temperature": 350.0,
        "setting_threshold_pixel": 10,
        "status_LD": 1,
        "status_LD_colorbar_max": 43.67277528171411,
        "status_LD_colorbar_min": 26.03879087057237,
        "status_LF": 1,
        "status_LF_colorbar_max": 43.63709112605318,
        "status_LF_colorbar_min": 26.03879087057237,
        "status_STAIR": 1,
        "status_STAIR_colorbar_max": 43.67277528171411,
        "status_STAIR_colorbar_min": 26.03879087057237,
        "status_available_space": 207.0,
        "status_recording": 0,
        "temperature_LD": 19.999993896484398,
        "temperature_LF": 19.999993896484398,
        "temperature_STAIR": 19.999993896484398
    };
    return output;
}