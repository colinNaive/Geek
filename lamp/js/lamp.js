//初始化变量
var canvasDiv=S(".canvas-div");
var canvas=new createjs.Stage('can');
var slideBar=S("#slide-bar");
var slideBtn=S("#slide-btn");
var slidePro=S("#slide-progress");
var total=S(".header");
var moveCircle;//手指跟随小圆
var switchCircle;//中间开关圆
var color="FFFFFF";
var light="64";
var freq=03;
//单色滚动条
var barSingle,btnSingle,proSingle,maxLSingle;
var barSingleLight,btnSingleLight,proSingleLight,maxLSingleLight;
//七色滚动条
var barSeven,btnSeven,proSeven,maxLSeven;
var barSevenLight,btnSevenLight,proSevenLight,maxLSevenLight;
//摇一摇随机数组
var arrayRandom = ["FC2429","3DFF47","2023FC","FFFD27","FE1F25","FFFFFF","11FEFE"];
var indexRandom=0;
var switchFlag;//打开关闭的标志位
 
//canvas尺寸长宽相等
canvasDiv.style.height=canvasDiv.offsetWidth+'px';
can.width=canvasDiv.offsetWidth;
can.height=canvasDiv.offsetHeight;
drawCircle();
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener('tick',canvas);
createjs.Touch.enable(canvas);

//获取点坐标的颜色值
canvas.addEventListener('pressmove',changeColor);
canvas.addEventListener('mousedown',changeColor);
canvas.addEventListener('click',centerClick);

//滚动条
var baseL=Math.floor(total.offsetWidth-slideBar.offsetWidth)/2;
var maxL=slideBar.offsetWidth;
slideBar.addEventListener('touchstart',moveLight);
slideBtn.addEventListener('touchstart',function(e){
	moveLight(e);
	document.addEventListener('touchmove',moveLight);
	document.addEventListener('touchend',function(){
		document.removeEventListener('touchmove',moveLight);
	});
});

//颜色选择块
setLiClick();

//彩灯单色闪烁点击
$("#singleFlash").click(function(){
	//显示单色闪烁设置弹窗
	showExtend("singleAlert");
	//发送单色闪烁控制指令
	freq="10";
	console.log("singleFlash="+'CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',01,'+freq+'\r\n')
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',01,'+freq+'\r\n'));
	//单色闪烁快慢的滚动轮
	singleSpeedSlide();
	//单色闪烁亮度的滚动轮
	singleLightSlide();
	//单色闪烁颜色选择块
	$(".singleLi").click(function(){
		var data_value=$(this).attr("data-value");
		color = data_value;
		console.log("link=="+'CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',01,0'+freq+'\r\n')
		SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',01,0'+freq+'\r\n'));
	});
});

//单色闪烁设置完成
$('#single_finish').click(function(){
	//发送指令
//	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',02,0'+freq+'\r\n'));
	$('#mybg,#singleAlert').hide();
});

//七色闪烁点击
$("#sevenFlash").click(function(){
	//显示单色闪烁设置弹窗
	showExtend("sevenAlert");
	//发送单色闪烁控制指令
	freq="10";
	console.log("sevenFlash="+'CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',02,'+freq+'\r\n')
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',02,'+freq+'\r\n'));
	//七色闪烁快慢的滚动轮
	sevenSpeedSlide();
	//七色闪烁亮度的滚动轮
	sevenLightSlide();
});

//七色闪烁设置完成
$('#seven_finish').click(function(){
	$('#mybg,#sevenAlert').hide();
});

//摇一摇点击
var SHAKE_THRESHOLD = 3000;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;
$('#shake').click(function(){
	initShake();
});
/************************************以下是函数部分*******************************/

function shakeChange(){
	indexRandom++;
	if(indexRandom>6){
		indexRandom=0;
	}
	var randomColor=arrayRandom[indexRandom];
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLRGB=1,'+randomColor+'64\r\n'));
}

//获取范围内的随机数
function random(min,max){
	return Math.floor(min+Math.random()*(max-min));
}

//单色闪烁亮度调节
function singleLightSlide(){
	barSingleLight=S("#bar-single-light");
	btnSingleLight=S("#btn-single-light");
	proSingleLight=S("#pro-single-light");
	maxLSingleLight=barSingleLight.offsetWidth;
	barSingleLight.addEventListener('touchstart',moveLightSingleLight);
	btnSingleLight.addEventListener('touchstart',function(e){
		moveLightSingleLight(e);
		document.addEventListener('touchmove',moveLightSingleLight);
		document.addEventListener('touchend',function(){
			document.removeEventListener('touchmove',moveLightSingleLight);
		});
	});
}

//单色闪烁快慢调节
function singleSpeedSlide(){
	barSingle=S("#bar-single-speed");
	btnSingle=S("#btn-single-speed");
	proSingle=S("#pro-single-speed");
	maxLSingle=barSingle.offsetWidth;
	barSingle.addEventListener('touchstart',moveLightSingle);
	btnSingle.addEventListener('touchstart',function(e){
		moveLightSingle(e);
		document.addEventListener('touchmove',moveLightSingle);
		document.addEventListener('touchend',function(){
			document.removeEventListener('touchmove',moveLightSingle);
		});
	});
}

//改变单色闪烁快慢
function moveLightSingle(e){
	e.preventDefault();
	var baseLSingle=Math.floor(total.offsetWidth-barSingle.offsetWidth)/2;
	var L=e.targetTouches[0].clientX-baseLSingle;//这里是怎么回事？？？？？？？？？
	if(L<=0){
		L=0;
	}else if(L>=maxLSingle){
		L=maxLSingle;
	}
	moveBar(L/maxLSingle,"singleSpeed");
	//设置亮度
	var light_=(L/maxLSingle)*10;
	freq=Math.floor(light_);
	console.log("singlefl="+'CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',01,0'+freq+'\r\n');
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',01,0'+freq+'\r\n'));
}

//改变单色闪烁亮度
function moveLightSingleLight(e){
	e.preventDefault();
	var baseLSingle=Math.floor(total.offsetWidth-barSingleLight.offsetWidth)/2;
	var L=e.targetTouches[0].clientX-baseLSingle;//这里是怎么回事？？？？？？？？？
	if(L<=0){
		L=0;
	}else if(L>=maxLSingleLight){
		L=maxLSingleLight;
	}
	moveBar(L/maxLSingleLight,"singleLight");
	//设置亮度
	var light_=(L/maxLSingleLight)*100;
	light_=Math.floor(light_);
	light_=light_.toString(16);
	light=padLeftHex(light_);
	console.log("singlefg="+'CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',01,0'+freq+'\r\n')
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',01,0'+freq+'\r\n'));
}

//七色闪烁快慢调节
function sevenSpeedSlide(){
	console.log("sevenSpeedSlide");
	barSeven=S("#bar-seven-speed");
	btnSeven=S("#btn-seven-speed");
	proSeven=S("#pro-seven-speed");
	maxLSeven=barSeven.offsetWidth;
	barSeven.addEventListener('touchstart',moveLightSeven);
	btnSeven.addEventListener('touchstart',function(e){
		moveLightSeven(e);
		document.addEventListener('touchmove',moveLightSeven);
		document.addEventListener('touchend',function(){
			document.removeEventListener('touchmove',moveLightSeven);
		});
	});
}

//改变七色闪烁快慢
function moveLightSeven(e){
	e.preventDefault();
	var baseLSeven=Math.floor(total.offsetWidth-barSeven.offsetWidth)/2;
	var L=e.targetTouches[0].clientX-baseLSeven;//这里是怎么回事？？？？？？？？？
	if(L<=0){
		L=0;
	}else if(L>=maxLSeven){
		L=maxLSeven;
	}
	moveBar(L/maxLSeven,"sevenSpeed");
	//设置亮度
	var light_=(L/maxLSeven)*10;
	freq=Math.floor(light_);
	console.log("teststestset="+freq);
	console.log("singlefl="+'CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',02,0'+freq+'\r\n');
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',02,0'+freq+'\r\n'));
}

//七色闪烁亮度调节
function sevenLightSlide(){
	barSevenLight=S("#bar-seven-light");
	btnSevenLight=S("#btn-seven-light");
	proSevenLight=S("#pro-seven-light");
//	alert("bar===="+barSevenLight);
	maxLSevenLight=barSevenLight.offsetWidth;
	barSevenLight.addEventListener('touchstart',moveLightSevenLight);
	btnSevenLight.addEventListener('touchstart',function(e){
		moveLightSevenLight(e);
		document.addEventListener('touchmove',moveLightSevenLight);
		document.addEventListener('touchend',function(){
			document.removeEventListener('touchmove',moveLightSevenLight);
		});
	});
}

//改变七色闪烁亮度
function moveLightSevenLight(e){
	e.preventDefault();
	var baseLSeven=Math.floor(total.offsetWidth-barSevenLight.offsetWidth)/2;
	var L=e.targetTouches[0].clientX-baseLSeven;//这里是怎么回事？？？？？？？？？
	if(L<=0){
		L=0;
	}else if(L>=maxLSevenLight){
		L=maxLSevenLight;
	}
	moveBar(L/maxLSevenLight,"sevenLight");
	//设置亮度
	var light_=(L/maxLSevenLight)*100;
	light_=Math.floor(light_);
	light_=light_.toString(16);
	light=padLeftHex(light_);
	console.log("sevenfg="+'CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',02,0'+freq+'\r\n')
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLMODE=1,'+color+light+',02,0'+freq+'\r\n'));
}

//正常情况下颜色块选择
function setLiClick(){
	$(".normalLi").click(function(){
		var data_value=$(this).attr("data-value");
		SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLRGB=1,'+data_value+'64\r\n'));
	});
	
}
//绘制彩灯大圆
function drawCircle(){
	var img=new Image();
	img.src='imgs/circle.png';
	img.onload=function(){
		var w=this.width;
		var h=this.height;
		var oCircle=new createjs.Bitmap(img.src);
		oCircle.scaleX=oCircle.scaleY=can.width/w;
		canvas.addChild(oCircle);
		drawMove();
		drawSwitchCircle();
	}
}

//绘制触摸跟随小圆
function drawMove(){
	moveCircle=new createjs.Shape();
	moveCircle.graphics.beginStroke("#000").drawCircle(0,0,8);
	moveCircle.x=(can.width-4)/2;
	moveCircle.y=(can.height-4)/2;
	canvas.addChild(moveCircle);
}

//绘制中间点击小圆
function drawSwitchCircle(){
	switchCircle=new createjs.Shape();
	switchCircle.graphics.beginFill("white").drawCircle(0,0,(can.width)/7);
	switchCircle.x=(can.width)/2;
	switchCircle.y=(can.height)/2;
	canvas.addChild(switchCircle);
}

//中间点击打开关闭
function centerClick(e){
	var x=e.stageX;
	var y=e.stageY;
	if(x>can.width/3 &&x<can.width/3*2 && y>can.height/3 && y<can.height/3*2){
		console.log("switch_flag="+switchFlag);
		switch(switchFlag){
			case "1":
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLCLOSE=1\r\n'));
			break;
			case "2":
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLOPEN=1\r\n'));
			break;
		}
	}
}

//改变亮度
function moveLight(e){
	e.preventDefault();
	var L=e.targetTouches[0].clientX-baseL;//这里是怎么回事？？？？？？？？？
	if(L<=0){
		L=0;
	}else if(L>=maxL){
		L=maxL;
	}
	moveBar(L/maxL,"normal");
	//设置亮度
	var light_=(L/maxL)*100;
	light_=light_.toString(16);
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLRGB=1,'+color+light_+'\r\n'));
}

//改变颜色
function changeColor(e){
	var x=e.stageX;
	var y=e.stageY;
	var cnt=can.getContext("2d");
	//画布指定矩形的像素数据，参数1:red，参数2:green，参数3:blue，参数4:alpha
	var rgba=cnt.getImageData(x,y,1,1).data;
	moveCircle.x=x;
	moveCircle.y=y;
//	cnt.globalAlpha=(rgba[3]/255).toFixed(2);//保留两位小数
	//移动alpha
	moveBar(Number(rgba[3]/255).toFixed(2),"normal");
	//设置颜色
	var color=rgba[0].toString(16)+rgba[1].toString(16)+rgba[2].toString(16);
	//有效区域
	if(x>can.width/3 &&x<can.width/3*2 && y>can.height/3 && y<can.height/3*2){
		return;
	}
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLRGB=1,'+color+'64\r\n'));
}

//拖动滚动条
function moveBar(pre,Str){
	switch(Str){
		case "normal":
			slideBtn.style.left=pre*100+"%";
			slidePro.style.width=pre*100+"%";
		break;
		case "singleSpeed":
			btnSingle.style.left=pre*100+"%";
			proSingle.style.width=pre*100+"%";
		break;
		case "singleLight":
			btnSingleLight.style.left=pre*100+"%";
			proSingleLight.style.width=pre*100+"%";
		break;
		case "sevenSpeed":
			btnSeven.style.left=pre*100+"%";
			proSeven.style.width=pre*100+"%";
		break;
		case "sevenLight":
			btnSevenLight.style.left=pre*100+"%";
			proSevenLight.style.width=pre*100+"%";
		break;
	}
};

//补全两位数
function padLeftHex(str){ 
	if(str >= 16) 
		return str; 
	else 
		return "0" +str; 
} 

//摇一摇初始化
function initShake() {
	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		alert('not support mobile event');
	}
}

//摇一摇结束监听
function stopShake() {
	if (window.DeviceMotionEvent) {
		window.removeEventListener('devicemotion', deviceMotionHandler, false);
	} else {
		alert('not support mobile event');
	}
}

//摇一摇
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
			shakeChange();
		}
		last_x = x;
		last_y = y;
		last_z = z;
	}
}

//选择器
/**************************************这到底是什么？*******************/
function S(selector){
	if (document.querySelectorAll(selector).length>1){
		return document.querySelectorAll(selector);
	}
	return document.querySelector(selector);
}