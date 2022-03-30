var config = require('./config');
const express = require('express');
const cors = require('cors')
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
    }), express.static(__dirname + '/'),
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
    res.sendFile(__dirname + '/index.html');
});

// 以下可以刪除
app.get('/api/initial', function (req, res) {
    const output = defaultArray()
    // console.log();
    res.send(output)
});

app.post('/api/changed', function (req, res) {
    const SpotData = JSON.parse(req.body)
    console.log(SpotData);
    res.send(SpotData)
});

function defaultArray() {
    output = {
        "status_LF_colorbar_max": null,
        "status_LF_colorbar_min": null,
        "status_STAIR_colorbar_max": null,
        "status_STAIR_colorbar_min": null,
        "status_LD_colorbar_max": null,
        "status_LD_colorbar_min": null,
        "status_LF": null,
        "status_STAIR": null,
        "status_LD": null,
        "status_recording": null,
        "status_available_space": null,
        "temperature_LF": null,
        "temperature_STAIR": null,
        "temperature_LD": null,
        "setting_reflected_temperature": null,
        "setting_atmospheric_temperature": null,
        "setting_object_temperature": null,
        "setting_object_emissivity": null,
        "setting_relative_humidity": null,
        "setting_external_optics_temperature": null,
        "setting_external_optics_transmission": null,
        "setting_pattern": null,
        "setting_calibration": null,
        "setting_once_calibration": null,
        "setting_once_autofocus": null,
        "setting_corlorbar_max": null,
        "setting_corlorbar_min": null,
        "setting_first_alarm_temperature": null,
        "setting_second_alarm_temperature": null,
        "setting_sampling_rate": null,
        "setting_threshold_pixel": null,
        "setting_export_maximum_data": null,
        "setting_export_image_video": null,
        "setting_export_camera_temperature": null,
    };
    return output;
}