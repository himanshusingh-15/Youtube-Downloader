var express = require('express');
var router = express.Router();
fs = require('fs');
youtubedl = require('youtube-dl');
ffmpeg = require('fluent-ffmpeg');

/* GET home page. */
router.post('/', function(req, res, next) {
	url = req.body.url;
	youtubedl.getInfo(url, function(err, info) {
		if(err)
			throw err;
		else {
			console.log("himanshu");
			audioFileName = "./public/download/" + info.title + ".mp3";
			videoFileName = "./public/download/" + info.title + ".mp4";
			youtubedl(url).pipe(fs.createWriteStream(videoFileName))
						  .on('close', function() {
						  	console.log("Finished Downloading");
						  	res.writeHeader(200, {"Content-Type": "text/html"});
						  	res.write('<html><body><a href="download/'+ info.title + '.mp4">' + info.title + '.mp4' + '</a><body></html>');
						  	res.end();
						  });
			/*proc = new ffmpeg({source:stream});
			proc.setFfmpegPath('./public/ffmpeg');
			proc.withAudioCodec('libmp3lame')
			.toFormat('mp3')
			.saveToFile(fileName, function(stdout, stderr) {
				res.send('File Converted');
			});
			console.log("Completed");*/
		}
	});
});

module.exports = router;
