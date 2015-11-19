function name() {
	alert("周小周");
}
var SHAKE_THRESHOLD = 3000;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;

function init() {
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		alert('not support mobile event');
	}
}

function deviceMotionHandler(eventData) {
	var acceleration = eventData.accelerationIncludingGravity;
	var curTime = new Date().getTime();
	if ((curTime - last_update) > 100) {
		var diffTime = curTime - last_update;
		last_update = curTime;
		x = acceleration.x;
		y = acceleration.y;
		z = acceleration.z;
		var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

		if (speed > SHAKE_THRESHOLD) {
			//			alert("摇动了");
			
			var media = document.getElementById("musicBox"); //获取音频控件
			media.setAttribute("src", "raw/shake.wav");
			media.load();
			media.play();
			document.getElementById('name').innerHTML = arrayName[random(0,6)];
		}
		last_x = x;
		last_y = y;
		last_z = z;
	}
}
var arrayName = new Array("王小二", "杜小于", "郭萌", "韩晓野", "欧阳明日", "张淑华", "周佳佳");
//获取范围内的随机数
function random(min, max) {
	return Math.floor(min + Math.random() * (max - min));
}

function music() {
	var media = document.getElementById("musicBox"); //获取音频控件
	media.setAttribute("src", "raw/shake.wav");
	media.load();
	media.play();
	document.getElementById('name').innerHTML = arrayName[random(0,6)];
}