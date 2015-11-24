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
    //添加设备列表
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
//	$('.appTime').style.height=$('.time_extend').offsetHeight+"px";
//	$("img").load(function(){
//	  alert($('.appTime').style.height);
//	  $('.appTime').style.height=$('.time_extend').offsetHeight+"px";
//	});
	$(window).load(function(){
//		alert($('#time_extend').height()+"px");
		$('.appTime').height($('#time_extend').height()+"px");
	});
	var lc1 = 0;
	var rc1 = $li1.length-1;
	var time_extend=1,time_set=1,power_protect=1;
	//插座按钮状态
	var state = false;
	var output = 'CONTROL ' + mac + ' P ' + passWord + ' AT+TIMETASK=1,';
	var ws;
	var editpass;
	//websocket连接
	ToggleConnectionClicked();
	if(sessionStorage.getItem("note")){
		note=sessionStorage.getItem("note");
	};
//	$('#input').html(note);
	$('.apply_array').click(function(){
		if(state){
//			apply_w">
//			<div class="apply_array">
//				<div class="apply_img">
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLOSE=1\r\n'));
//			document.getElementById("buttonlogo").src="assets/img/poweroff.png";
			state = false;
		}else{
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+OPEN=1\r\n'));
//			document.getElementById("buttonlogo").src="assets/img/poweron.png";
			state = true;
		}
	});
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
	$('#alert').click(function(e){
		e.stopPropagation();
	});
	$('#time_extend').click(function(e){
		e.stopPropagation();
	});
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
		mybg.setAttribute("onclick", 'clickEvent()');    
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
	$('#reset').click(function(e){
		e.stopPropagation();
		HandleOnClose();
	});
	$('#change_psw').click(function(e){
		e.stopPropagation();
		var r=window.confirm("设置本地设备密码？");
		if (r==true){
			editpass = prompt("输入新的密码");
			if(editpass.length != 6){
				alert("设置密码长度必须为6位");
			}else{
				password_[index_] = editpass;
				passWord = editpass;
				var xmlhttp;
				if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				}else{// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange=function(){
					if (xmlhttp.readyState==4 && xmlhttp.status==200){
						alert(xmlhttp.responseText);
					}
				}
				var url = "device.info/password.php";
				url = url + "?mac=" + mac_[index_];
				url = url + "&openid=" + openid;
				url = url + "&pwd=" + passWord;
				xmlhttp.open("POST",url,true);
				xmlhttp.send();	
			} 
		}else{
			var r1=window.confirm("设置远程设备密码？");
			if (r1==true){
				editpass = prompt("输入新的密码");
				if(editpass.length != 6){
					alert("设置密码长度必须为6位");
				}else{
					SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+EDITPWD='+ editpass +'\r\n'));
				}
			}else{
			}
		}
	});	
	$('#select').click(settingClick);
	$(document).click(function(){
	    $('.setting_menu .div_img_setting_then').css('display','none');
	    $('#alert').css('display','none');
	});
});
function clickEvent(){
	$('#mybg').css('display','none');
	$('#alert').css('display','none');
}
/*子函数部分*/
function addDeviceList(obj) {
	var div_out = document.getElementById(obj);
	for(i=0;i<count+1;i++){
		var div = document.createElement("div");
		div.setAttribute("class","apply_array");
		var div_in = document.createElement("div");
		div_in.setAttribute("class","apply_img");
		var img = document.createElement("img");
		img.setAttribute("src","imgs/plug.png");
		var label = document.createElement("label");
		label.setAttribute("class","name");
		label.innerHTML = noteList[i];
		div_in.appendChild(img);
		div.appendChild(div_in);
		div.appendChild(label);
		div_out.appendChild(div);
	}
}

//连接websocket
function ToggleConnectionClicked() {
	try {
		ws = new WebSocket("ws://121.42.46.59:5120", "HFWiFidevice-protocol"); //连接服务器		
		ws.onopen = function(event) {
			console.log("与服务器建立了连接");//this.readyState=1
			num = 0;
		};
		ws.onmessage = function(event) {
			console.log("接收到服务器发送的数据");
			var temp = "" + event.data;
			var reg = /\s/g;
			var output = temp.replace(reg, "");
			var output_text = Decrypt(output);
			console.log(output_text);
			switch (num) {
				case 0:
					SendData(Encrypt('E1B26EFADF519869CD1A73C7CB9904C1'));
					num++;
					break;
				case 1:
					SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+NODE=1\r\n'));
					num++;
					break;	
			}
			if(output_text.indexOf("+NODE:#1,")!=-1){
				var x=output_text.indexOf("+NODE:#1,")+9;
				output_text.split("");
				console.log(output_text[x]+'@End');
				if(output_text[x]==1){
					RecieveToggle(true);
				}
				if(output_text[x]==2){
					RecieveToggle(false);
				}
			}
			if(output_text.indexOf("NOLINK")!=-1){
				$('#input').css('color','red');
				$('#input').html("设备离线");
				$('#Toggle').attr({"disabled":"disabled"});
				$('#AddTimeExt').attr({"disabled":"disabled"});
				$('#AddTimeSet').attr({"disabled":"disabled"});
			}
			if(output_text.indexOf("+NODE:")!=-1){
				if(sessionStorage.getItem("note")){
					note=sessionStorage.getItem("note");
				};
				$('#input').html(note);
				$('#input').css('color','white');
				$('#Toggle').removeAttr("disabled");
				$('#AddTimeExt').removeAttr("disabled");
				$('#AddTimeSet').removeAttr("disabled");
			}
			if(output_text.indexOf("+EDITPWD:")!=-1){
				var x=output_text.indexOf("+EDITPWD:")+9;
				var temp="" + output_text.substring(x,output_text.size).trimRight();
				alert('密码设置成功!\n当前密码'+temp);
				password_[index_] = editpass;
				passWord = editpass;
				var xmlhttp;
				if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				}else{// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange=function(){
					if (xmlhttp.readyState==4 && xmlhttp.status==200){
						alert(xmlhttp.responseText);
					}
				}
				var url = "device.info/password.php";
				url = url + "?mac=" + mac_[index_];
				url = url + "&openid=" + openid;
				url = url + "&pwd=" + passWord;
				xmlhttp.open("POST",url,true);
				xmlhttp.send();	
			}
			if(output_text.indexOf("+PWD:1")!=-1){
				alert('设备密码错误，请与设备所有者联系!');
			}												
			if(output_text.indexOf("+TIMESHUT:#1,")!=-1){
				var x=output_text.indexOf("+TIMESHUT:#1,")+13;
				var temp=""+output_text.substring(x,output_text.size).trimRight();
				console.log(temp+'@End');
				temp = temp.split(",");
				if(temp[0]==0){
					$('#delay_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后关闭');
				}
				if(temp[0]==1){
					$('#delay_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后开启');
				}
				if(temp[0]==2){
					$('#delay_text').html('当前无延时任务');
				}
			}
			if(output_text.indexOf("+TIMETASK:#1,")!=-1){
				var x=output_text.indexOf("+TIMETASK:#1,")+13;
				var temp=""+output_text.substring(x,output_text.size).trimRight();
				console.log(temp+'@End');
				temp = temp.split(",");
				console.log('HEX:' + temp[0]);
				var _1th = parseInt(temp[0],16).toString(2);
				console.log('BIN:' + _1th);
				var t = parseInt(temp[0],16).toString(2);
				_1th = _1th.split("");
				var text = '定时:';
				if(_1th[0]==1){
					if(_1th[1]==1){
						text=text+' 周六 ';
					}
					if(_1th[2]==1){
						text=text+' 周五 ';
					}
					if(_1th[3]==1){
						text=text+' 周四 ';
					}
					if(_1th[4]==1){
						text=text+' 周三 ';
					}
					if(_1th[5]==1){
						text=text+' 周二 ';
					}
					if(_1th[6]==1){
						text=text+' 周一 ';
					}
					if(_1th[7]==1){
						text=text+' 周日 ';
					}
					text = text + ' ' + parseInt(t.substring(11,16),2).toString(10);
					text = text + ':' + padLeft(parseInt(t.substring(16,32),2).toString(10));
					if(parseInt(t.substring(8,11),2).toString(10)==1){
						text=text+' 开启';
					}
					if(parseInt(t.substring(8,11),2).toString(10)==2){
						text=text+' 关闭';
					}
					console.log(text);
					$('#timer_text').html(text);								
				}else{
					$('#timer_text').html("当前无定时任务");
				}
			}
		};
		ws.onclose = function(event) {
			if(mac != ''){
				alert("与服务器断开连接"); //this.readyState=3
			}
			AlertDeviceState();
			$('#link').attr("disabled", false);
		};
		ws.onerror = function(event) {
			AlertDeviceState();
			alert("服务器异常！请稍后再试");
		};
	} catch (ex) {
		alert(ex.message);
	}
};
//恢复出厂设置
function HandleOnClose() {
	  var close = confirm("确定恢复出厂设置?");
	  if (close) {
		SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+DFT\r\n'));
		alert('设备已重置，请重新配置！');
		$('#input').css('color','red');
		$('#input').html("设备离线");
		$('#Toggle').attr({"disabled":"disabled"});
		$('#AddTimeExt').attr({"disabled":"disabled"});
		$('#AddTimeSet').attr({"disabled":"disabled"});
	  }
	  else{
		window.event;
	  }
	  return message;
}
//警告
function AlertDeviceState(){
	alert("jinggao");
//	if(mac == ''){
//			$('#input').html("没有设备");
//			$('#input').css('color','red');
//	}else{
//		$('#input').html("设备离线");
//		$('#input').css('color','red');
//	}
//	$('#Toggle').attr('disabled',"true");//添加disabled属性 
//	//$('#AddTimeExt').attr('disabled',"true");//添加disabled属性 
//	$('#AddTimeSet').attr('disabled',"true");//添加disabled属性 
}
//发送数据
function SendData(Str) {
	if (ws.readyState == 1)
		try {
			var temp = "" + Str;
			var reg = /\s/g;
			var output = temp.replace(reg, "");
			ws.send(output);
			console.log('SEND:' + output);
		} catch (ex) {
			alert(ex.message);
		}
};
//接收数据
function RecieveToggle(Str){
	if(Str){
		document.getElementById("buttonlogo").src="assets/img/poweron.png";
		state = true;
	}else{
		document.getElementById("buttonlogo").src="assets/img/poweroff.png";
		state = false;
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

function settingClick(e){
	e.stopPropagation();
//	alert("abc");
	if(settingClickFlag==1){
		settingClickFlag=0;
		$('.setting_menu .div_img_setting_then').css('display','');
	}else{
		settingClickFlag=1;
		$('.setting_menu .div_img_setting_then').css('display','none');
	}
}