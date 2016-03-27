var express = require('express');
var router = express.Router();
var fs = require('fs');
var youtubedl = require('youtube-dl');
var ffmpeg = require('fluent-ffmpeg');

/* GET home page. */
router.post('/', function(req, res, next) {
	url = req.body.url;
	type = req.body.type;
	console.log(type);
	var video = youtubedl(url, ['-f', 'best']);
	var size = 0;

	video.on('info', function(info) {
		'use strict';
		size = info.size;
		console.log('GOT video info');

		var title = info.title;
		var thumbnail = info.thumbnail;

		var audioFileName = "./public/download/" + title + ".mp3";
		var videoFileName = "./public/download/" + title + ".mp4";

		var downlink = 'download/' + title + '.mp4';

		res.render('download', {
			title: title,
			link: downlink,
			thumb: thumbnail
		});
		
		video.pipe(fs.createWriteStream(videoFileName));

		/*proc = new ffmpeg({source:stream});
		proc.setFfmpegPath('./public/ffmpeg');
		proc.withAudioCodec('libmp3lame')
		.toFormat('mp3')
		.saveToFile(fileName, function(stdout, stderr) {
			res.send('File Converted');
		});
		console.log("Completed");*/
	});

	var pos = 0;
	video.on('data', function data(chunk) {
		'use strict';
		pos += chunk.length;

		if (size) {
    		var percent = (pos / size * 100).toFixed(0);
		    console.log(percent + '%');
		    req.app.locals.download = percent;
  		}
	});

	video.on('end', function end() {
		'use strict';
		console.log('\nDone');
		//res.writeHeader(200, {"Content-Type": "text/html"});
	  	//res.write('<html><body><a href="download/'+ title + '.mp4">' + title + '.mp4' + '</a><body></html>');
	  	//res.end();
	});

});

module.exports = router;
