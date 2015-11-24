var settingClickFlag=1;
$(function(){
	//变量定义
	var currYear = (new Date()).getFullYear();	
	var opt={};
	opt.date = {preset : 'date'};
	opt.datetime = {preset : 'datetime'};
	opt.time = {preset : 'time'};
	opt.default = {
		theme: 'android-ics light', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
		dateFormat: 'yyyy-mm-dd',
		lang: 'zh',
		showNow: true,
		nowText: "今天",
        startYear: currYear - 10, //开始年份
        endYear: currYear + 10 //结束年份
	};
	var optTime = $.extend(opt['time'], opt['default']);
    $("#appTime").mobiscroll(optTime).time(optTime);
    addDeviceList('apply_w');
	$li1 = $(".apply_nav .apply_array");
	$window1 = $(".apply .apply_w");
	$left1 = $(".apply .img_l");
	$right1 = $(".apply .img_r");
	$time_extend= $("#time_extend");
	$time_set= $("#time_set");
	$power_protect= $("#power_protect");
	$window1.css("width", $li1.length*7.2+"rem");
	var clickEvent="ontouchstart" in document.documentElement ? "touchstart" :"click";
	var myAlert = document.getElementById("alert"); 
	var extend_trigger = document.getElementById("time_extend");
	$('.setting_menu .div_img_setting_then').css('display','none');
	var lc1 = 0;
	var rc1 = $li1.length-1;
	var time_extend=1,time_set=1,power_protect=1;
	$left1.click(function(){
		if (lc1 < 1) {
			alert("已经是第一张图片");
			return;
		}
		lc1--;
		rc1++;
		$window1.animate({left:'+=6.8rem'}, 1000);
	});

	$right1.click(function(){
		if (rc1 < 1){
			alert("已经是最后一张图片");
			return;
		}
		lc1++;
		rc1--;
		$window1.animate({left:'-=6.8rem'}, 1000);
	});
	
	/* 弹窗 */
	myAlert.addEventListener(clickEvent,function(e){
		e.stopPropagation();
	},false);
	//延时任务弹窗点击
	extend_trigger.onclick = function()  
	{  
		myAlert.style.display = "block";  
		myAlert.style.position = "absolute";  
		myAlert.style.top = "50%";  
		myAlert.style.left = "50%";  
		myAlert.style.marginTop = (-myAlert.offsetHeight/2)+"px"; 
		myAlert.style.marginLeft = (-myAlert.offsetWidth/2)+"px"; 
		mybg = document.createElement("div");  
		mybg.setAttribute("id","mybg");  
		mybg.style.background = "#000";  
		mybg.style.width = "100%";  
		mybg.style.height = "100%";  
		mybg.style.position = "absolute";  
		mybg.style.top = "0";  
		mybg.style.left = "0";  
		mybg.style.zIndex = "500";  
		mybg.style.opacity = "0.3";  
		mybg.style.filter = "Alpha(opacity=30)";  
		document.body.appendChild(mybg);  
		document.body.style.overflow = "hidden";  
	}
	
});

/*子函数部分*/
function addDeviceList(obj) {
	var div_out = document.getElementById(obj);
	alert(count);
	for(i=0;i<count;i++){
//		<div class="apply_array">
//			<div class="apply_img"><img src="imgs/plug.png" /></div>
//			<label class="name">智能插座</label>
//		</div>
		var div = document.createElement("div");
		div.setAttribute("class","apply_array");
//		li.setAttribute("style", "text-align:center");
		var div_in = document.createElement("div");
//		input_.setAttribute("type","button");
		div_in.setAttribute("class","apply_img");
		var img = document.createElement("img");
		img.setAttribute("src","imgs/plug.png");
		var label = document.createElement("label");
		label.setAttribute("class","name");
		label.innerHTML = noteList[i];
//		label_.setAttribute("id","label"+i);
//		label_.setAttribute("for","button_download");
//		label_.setAttribute("style","display:block;line-height:0.6rem; height:0.6rem; font-size:0.3rem ;color:#FFFFFF");				
		div_in.appendChild(img);
		div.appendChild(div_in);
		div.appendChild(label);
		div_out.appendChild(div);
		}
}
function touchclick(str){
	switch(str){
		case "power_protect":
			$("#power_protect").attr("src","imgs/power_protect.png");
			setTimeout(function(){$("#power_protect").attr("src","imgs/power_protect_before.png");},300);
		break;
		case "time_set":
			$("#time_set").attr("src","imgs/time_set.png");
			setTimeout(function(){$("#time_set").attr("src","imgs/time_set_before.png");},300);
		break;
		case "time_extend":
			$("#time_extend").attr("src","imgs/time_extend.png");
			setTimeout(function(){$("#time_extend").attr("src","imgs/time_extend_before.png");},300);
		break;
		case "img_r":
			$(".apply .img_r").attr("src","imgs/right.png");
			setTimeout(function(){$(".apply .img_r").attr("src","imgs/right_before.png");},300);
		break;
		case "img_l":
			$(".apply .img_l").attr("src","imgs/left.png");
			setTimeout(function(){$(".apply .img_l").attr("src","imgs/left_before.png");},300);
		break;
	}
}

function settingClick(){
	if(settingClickFlag==1){
		settingClickFlag=0;
		$('.setting_menu .div_img_setting_then').css('display','');
	}else{
		settingClickFlag=1;
		$('.setting_menu .div_img_setting_then').css('display','none');
	}
}