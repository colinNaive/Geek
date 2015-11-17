//初始化变量
var canvasDiv=S(".canvas-div");
console.log("canvasDiv="+canvasDiv);
var canvas=new createjs.Stage('can');
console.log("canvas="+canvas);
var slideBar=S(".slide-bar");
var slideBtn=S(".slide-btn");
var slidePro=S(".slide-progress");
var total=S(".header");
var moveCircle;
var color;
var light;

//canvas尺寸长宽相等
canvasDiv.style.height=canvasDiv.offsetWidth+'px';
can.width=canvasDiv.offsetWidth;
can.height=canvasDiv.offsetHeight;
console.log("canvasdivheight="+canvasDiv.style.height);
console.log("canvasdivwidth="+canvasDiv.style.width);
drawCircle();
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener('tick',canvas);
createjs.Touch.enable(canvas);

//获取点坐标的颜色值
canvas.addEventListener('pressmove',changeColor);
canvas.addEventListener('mousedown',changeColor);

//滚动条
console.log("totalwidth="+total.offsetWidth);
console.log("slidebarwidth="+slideBar.offsetWidth);
var baseL=Math.floor(document.body.clientWidth-slideBar.offsetWidth)/2;//这到底是什么？？？？？？？？？？
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

/************************************以下是函数部分*******************************/
//ul中li的点击事件
function setLiClick(){
	$(".color-picker .color-li").click(function(){
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

//改变亮度
function moveLight(e){
	e.preventDefault();
	console.log("touches="+e.targetTouches[0].clientX);
	console.log("basel="+baseL);
	var L=e.targetTouches[0].clientX-baseL;//这里是怎么回事？？？？？？？？？
	console.log("dianji="+L);
	if(L<=0){
		L=0;
	}else if(L>=maxL){
		L=maxL;
	}
	moveBar(L/maxL);
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
	cnt.globalAlpha=(rgba[3]/255).toFixed(2);//保留两位小数
	//移动alpha
	moveBar(Number(rgba[3]/255).toFixed(2));
	//设置颜色
	var color=rgba[0].toString(16)+rgba[1].toString(16)+rgba[2].toString(16);
	console.log("result_color="+color);
	SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLRGB=1,'+color+'64\r\n'));
}

//拖动滚动条
function moveBar(pre){
	slideBtn.style.left=pre*100+"%";
	slidePro.style.width=pre*100+"%";
};

//选择器
/**************************************这到底是什么？*******************/
function S(selector){
	if (document.querySelectorAll(selector).length>1){
		return document.querySelectorAll(selector);
	}
	return document.querySelector(selector);
}