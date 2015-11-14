//初始化变量
var canvasDiv=$('.canvas-div');
var canvas=new createjs.Stage('can');
//var slideBar=$(".slide-bar");
//var slideBtn=$(".slide-btn");
//var slidePro=$(".slide-progress");
//var total=$(".total");
var moveCircle;

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

//滚动条
var baseL=Math.floor(total.offsetWidth-slideBar.offsetWidth)/2;
var maxL=slideBar.offsetWidth;
slideBar.addEventListener('touchstart',moveAlpha);
slideBtn.addEventListener('touchstart',function(e){
	moveAlpha(e);
	document.addEventListener('touchmove',moveAlpha);
	document.addEventListener('touchend',function(){
		document.removeEventListener('touchmove',moveAlpha);
	});
});

/************************************以下是函数部分*******************************/
//绘制彩灯大圆
function drawCircle(){
	var img=new Image();
	img.src='./img/circle.png';
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

//改变透明度
function moveAlpha(e){
	e.preventDefault();
	var L=e.targetTouches[0].clientX-baseL;//这里是怎么回事？？？？？？？？？
	if(L<=0){
		L=0;
	}else if(L>=maxL){
		L=maxL;
	}
	moveBar(L/maxL);
	var cnt=can.getContext("2d");
	cnt.globalAlpha=(L/maxL).toFixed(2);
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
	console.log("r---->"+rgba[0]+"g---->"+rgba[1]+"b---->"+rgba[2]+"a------>"+rgba[3]);
//	total.style.backgroundColor="rgba("+rgba[0]+","+rgba[1]+","+rgba[2]+","+rgba[3]+")";
	cnt.globalAlpha=(rgba[3]/255).toFixed(2);//保留两位小数
	//移动alpha
	moveBar(Number(rgba[3]/255).toFixed(2));
}

//拖动滚动条
function moveBar(pre){
	slideBtn.style.left=pre*100+"%";
	slidePro.style.width=pre*100+"%";
};

//选择器
function $(selector){
	if (document.querySelectorAll(selector).length>1){
		return document.querySelectorAll(selector);
	}
	return document.querySelector(selector);
}