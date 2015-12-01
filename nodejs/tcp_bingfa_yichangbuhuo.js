var net = require('net');
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var log4js = require('log4js');
var domain = require('domain');
var os = require('os');
var HOST = '121.40.77.63';
var PORT = 5000;
log4js.configure({
	"appenders":[
		{type:'console'},
		{type:'file',filename:'logs/info.log',category:'info'},
		{type:'file',filename:'logs/err.log',category:'err'}
	],
	"level":{
		"info":"INFO",
		"err":"ERROR"
	}
});
var logError = log4js.getLogger('err');
var logInfo = log4js.getLogger('info');
try{
	var server = net.createServer(function(socket) {
		/**第一个domain(domain的作用是异常捕获)**/
		/**如果觉得加domain程序太乱，则可以只看以下d.run(function() {}里的部分即可**/
		var d = domain.create();
		d.add(socket);
		d.run(function() {
			///////////////////////以下为有用部分///////////////////////////////////////////////
			/**初始化变量**/
			var start_recv_flag = false;
			var CreateStreamFlag=false;
			var now = Date.now();
			var file_name = "D:\\tools\\nodejs\\audio\\" + now + ".spx"; //D:\tools\nodejs
			var file_name_delete;
			var finish_recv_flag = false;
			var length = 0;
			var recogFlag = false;
			var post_data = querystring.stringify({
				filename: now,
			});
			var stream;
			var opt = {
				host: 'localhost',
				port: 80,
				method: 'POST',
				path: 'http://121.40.77.63/querydata/sample_voice/php/sample_7.php',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': post_data.length
				}
			};
			logInfo.info('CONNECTED: ' +
				socket.remoteAddress + ':' + socket.remotePort);
			socket.write("lianjiechenggong");
			/**接收到数据**/
			socket.on('data', function(data) {
				//throw new Error("exception in member function");
				length = data.length;
				logInfo.info("data_length="+length);
				start_recv_flag = (data[0] == 0x22 && data[1] == 0x22);
				logInfo.info("***********"+start_recv_flag+"**************");
				if(start_recv_flag||CreateStreamFlag){
					/**收到第一包数据创建文件**/
					if(!CreateStreamFlag){
						CreateStreamFlag=true;
						logInfo.info("*********jinjinjinjinjinnjinjinjin*******************");
						now = Date.now();
						file_name = "D:\\tools\\nodejs\\audio\\" + now + ".spx"; //D:\tools\nodejs
						stream = fs.createWriteStream(file_name);
						post_data = querystring.stringify({
							filename: now,
						});
						return;
					}
					/***收到有用数据***/
					finish_recv_flag = (data[length - 1] == 0x11 && data[length - 2] == 0x11);
					logInfo.info("###########"+finish_recv_flag+"#########");
					/**收到最后一包删除文件**/
					if (finish_recv_flag) {
						finish_recv_flag = false;
						CreateStreamFlag = false;
						recogFlag = true;
						logInfo.info("**********************zuihouyibao**************************");
					}
					var test = stream.write(data);
					if (!recogFlag) {
						return;
					}
					stream.end();
					if (test && recogFlag) {
						//如果文件接收完，发送http请求，进行语音识别
						logInfo.info("okokokok" + socket.remoteAddress);
						var body = "";
						var req = http.request(opt, function(res) {
							/**第二个domain(该处的domain也是用于异常捕获，d.run(function() {}里为有用部分)**/
							var d = domain.create();
							d.add(res);
							d.run(function() {
								res.on('data', function(d) {
									body = d+"";
								}).on('end', function() {
									logInfo.info(body);
									if (body.indexOf("errno") >= 0) {
										logInfo.info("hechengcuowu");
										deleteFile(file_name);
									} else {
										socket.write(body);//此处为nodejs向单片机回传数据
										deleteFile(file_name);
									}
									recogFlag = false;
								});
							});
							d.on('error', function(er) {
								  logError.error("errIndomain:"+er);
							});
						}).on('error', function(e) {
							logError.err("Got error: " + e.message);
						});
						var states = fs.statSync(file_name); 
						logInfo.info("filesize="+states.size);
						req.write(post_data + "\n");
						req.end();
					}
				}
			});
		  
			socket.on('close', function(data) {
				logInfo.info('CLOSED: ' +
					socket.remoteAddress + ' ' + socket.remotePort);
			});
			//////////////////////////////以上为有用部分//////////////////////////////////////////////////
		});
		d.on('error', function(er) {
			  logError.error("err in domain:"+er);
		});
	});
	server.listen(PORT, HOST);
}catch(err){
	logError.error(err);
}

//删除文件 
function deleteFile(file) {
	fs.unlink(file, function(err) {
		if (err) {
			logInfo.info("fail_delete" + err);
		}else{
			logInfo.info('success_delete:'+'file:' +file);
		}
		logInfo.info('free mem : ' + Math.ceil(os.freemem()/(1024*1024)) + 'mb');
	});
}
logInfo.info('Server listening on ' + HOST + ':' + PORT);