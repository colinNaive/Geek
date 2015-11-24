var ws;
/*********状态初始化************/
var settingClickFlag=1;
var canClick=true;//允许点击
var state = false,state_up=false,state_down=false,state_total_on=false,state_total_off=false;//插排上的开关状态
var chosenButton=1;
$(function(){
    //添加设备列表
    addDeviceList('apply_w');
    //websocket连接
	connectWebsocket();
    //延时弹窗隐藏
    $('#mybg').hide();
	$li1 = $(".apply_nav .apply_array");
	$window1 = $(".apply .apply_w");
	$left1 = $(".apply .img_l");
	$right1 = $(".apply .img_r");
	$time_set= $("#time_set");
	$power_protect= $("#power_protect");
	$window1.css("width", $li1.length*8.4+"rem");
	var clickEvent="ontouchstart" in document.documentElement ? "touchstart" :"click";
	var myAlert = document.getElementById("alert"); 
	$('.setting_menu .div_img_setting_then').css('display','none');
	$('.box_input').hide();
	$('.box').hide();
	$('.extend_time').hide();
	var time_extend=1,time_set=1,power_protect=1;
	var output = 'CONTROL ' + mac + ' P ' + passWord + ' AT+TIMETASK=1,';
	var editpass;
	var lc1 = currentIndex;
	var rc1 = $li1.length-1-currentIndex;
	var currentLocation=0;
	var deviceList;
	var deviceListStripUp,deviceListStripDown;
	//初始化设备mac、note、password、type
	mac=mac_[currentIndex].trim();
	note = note_[currentIndex];
	passWord = password_[currentIndex].trim();
	type = type_[currentIndex].trim();
	lampBottomDisplay();//彩灯颜色滚动条和颜色选择块的显示控制
	console.log("type="+type);
	//初始化当前设备位置
	currentLocation= 8.4*currentIndex;
	$window1.animate({left:'-='+currentLocation+'rem'}, 1);
	/*******插座部分控制*********/
	addDeviceListControl();
	/*******左右位置移动*********/
	$left1.click(function(){
		if (lc1 < 1) {
			alert("已经是第一台设备");
			return;
		}
		lc1--;
		rc1++;
		$window1.animate({left:'+=8.4rem'}, 500);
		currentIndex--;
		mac=mac_[currentIndex].trim();
		note = note_[currentIndex];
		type = type_[currentIndex];
		console.log("left_type="+type);
		passWord = password_[currentIndex].trim();
		lampBottomDisplay();//彩灯颜色滚动条和颜色选择块的显示控制
	});

	$right1.click(function(){
		
		if (rc1 < 1){
			alert("已经是最后一台设备");
			return;
		}
		lc1++;
		rc1--;
		$window1.animate({left:'-=8.4rem'}, 500);
		currentIndex++;
		mac=mac_[currentIndex].trim();
		note = note_[currentIndex];
		type = type_[currentIndex];
		console.log("right_type="+type);
		passWord = password_[currentIndex].trim();
		lampBottomDisplay();//彩灯颜色滚动条和颜色选择块的显示控制
	});
	
	/* 弹窗 */
	$('#time_extend').click(function(){
		if(canClick){
			$(".box_input,.box,.extend_time").hide();//显示之前先全部隐藏
			showExtend("alert");//延时弹窗显示
			console.log("type_exten="+type);
			if(type=="0"){
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+TIMESHUT=1?\r\n'));
			}else if(type=="W05"){
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLTIMESHUT=1?\r\n'));
			}else if(type=="W04"){
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSTIMESHUT='+chosenButton+'?\r\n'));
//				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSDFT\r\n'));
			}
		}else{
			alert("该设备离线");
		}
	});
	
	//定时跳转
	$('#time_set').click(function(){
		if(canClick){
			console.log("type="+type);
			window.location.href="http://www.shuworks.com/HFQL/smart/timer.php?mac="+mac+"&passWord="+passWord+"&type="+type;
		}else{
			alert("该设备离线");
		}
	});
	
	//关闭延时
	$('#extend_cancel').click(function(){
		$('#mybg,#alert,.extend_time').hide();
		if(type=="0"){
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+TIMESHUT=1,2,0\r\n'));
		}else if(type=="W05"){
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLTIMESHUT=1,2,0\r\n'));
		}else if(type=="W04"){
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSTIMESHUT='+chosenButton+',2,0\r\n'));
		}
	});
	
	//恢复出厂设置点击
	$('#reset').click(function(e){
		e.stopPropagation();
		if(canClick){
			HandleOnClose();
		}else{
			alert("该设备离线");
		}
	});
	
	//修改密码
	$('#change_psw').click(function(e){
		e.stopPropagation();
		if(!canClick){
			alert("该设备离线");
			return;
		}
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
	//固件更新
//	$('#update').click(function(e){
//		e.stopPropagation();
////		SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+V'+'\r\n'));
//		$.ajax({  
////          url:"jq_readXml.jsp?rnum="+<%=num%>,  
//			url:"http://home.huafanyq.com:8550/home/wifi2/firmware/HF-SP2-WiFiPlug/version.xml",  
//          type:"GET",  
//          dataType:"JSONP",  
//          timeout: 5000,  
//          error: function(xml){  
//              alert('Error loading XML document'+xml);  
//          },  
//          success: function(xml){  
//          	alert(xml);
////              $(xml).find("student").each(function(i){  
////                  var id=$(this).children("id");   //取对象  
////                  var id_value=$(this).children("id").text();  //取文本 或者 $("id" , xml).text();   
////                  var name_value=$(this).children("name").text();  
////                  //alert(id_value);//这里就是ID的值了。  
////                  //alert($(this).attr("email")); //这里能显示student下的email属性。  
////                  $('<li></li>').html(id_value+"&nbsp;&nbsp;&nbsp;"+name_value+"&nbsp;&nbsp;&nbsp;"+$(this).attr("email")).appendTo('ol');  
////              });  
//          }  
//      }); 
//	});
	//设置按钮点击
	$('#select').click(settingClick);
	
	//延时弹窗点击ok
	var delay_switch=1;
	var delay_long=0;
	$('#time_extend_ok').click(function(){
		if($('#check_1').attr("checked")){
			delay_switch=1;
		}else{
			delay_switch=0;
		}
		delay_long=$('#time_extend_input').val();
		if(delay_long!=""){
			if(type=="0"){
				console.log("chazuodianji");
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+TIMESHUT=1,' + delay_switch + ',' + delay_long + '\r\n'));
			}else if(type=="W05"){
				console.log("caidengdianji");
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLTIMESHUT=1,' + delay_switch + ',' + delay_long + '\r\n'));
			}else if(type=="W04"){
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSTIMESHUT='+chosenButton+',' + delay_switch + ',' + delay_long + '\r\n'));
			}
		}
		$('#mybg,#alert,.box,.box_input').hide();
	});
	
	//back键返回
	$('#back').click(function(){
		window.location.href="http://www.shuworks.com/HFQL/smart/main.php";
	});
	
	//更改名称
	$('.name').click(function(e){
		$('.edit').css("display","");
		$('.name').css("display","none");
		$('.edit').val(note);
		$('#edit'+currentIndex).focus();
		$('.bottom').css("display","none");
		$('.setting_menu').css("display","none");
	});
	$('.edit').blur(function(){
		$('.name').css("display","");
		$('.edit').css("display","none");
		$('.bottom').css("display","");
		$('.setting_menu').css("display","");
		note = this.value;
		if(this.value==""){
			note = "空";
		}
		note_[currentIndex] = this.value;
		$('.name').html(note);
	});
	$(document).click(function(){
	    $('.setting_menu .div_img_setting_then').css('display','none');
	    $("#shake").attr('src',"imgs/shake_before.png"); 
	   	//取消摇一摇监听
	   	stopShake();
	});
});

/***************************************以下为子函数部分*******************************************/

//添加智能设备控制部分
function addDeviceListControl(obj){
	/******插座部分控制******/
	if($('.edit')!=null){
		$('.edit').css("display","none");
	}
	deviceList=$('.apply_img .plug');
	if(deviceList!=null){
		for(var i=0;i<deviceList.length;i++){
			deviceList[i].id="No" + i;
		}
		deviceList.click(function(){
			if(!canClick){
				return;
			}
			if(state){
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLOSE=1\r\n'));
				$("#No"+currentIndex).attr('src',"imgs/plug_off.png"); 
				state = false;
			}else{
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+OPEN=1\r\n'));
				$('#No'+currentIndex).attr('src',"imgs/plug.png"); 
				state = true;
			}
		});
	}
	/******插排部分点击控制******/
	controlSwitchStrip(".apply_img .strip_up","up");
	controlSwitchStrip(".apply_img .strip_down","down");
	controlSwitchStrip(".apply_array .strip_switch_on","total_on");
	controlSwitchStrip(".apply_array .strip_switch_off","total_off");
}

//控制插排开关函数
function controlSwitchStrip(name,position){
	var deviceListStrip=$(''+name);
	if(deviceListStrip!=null){
		deviceListStrip.click(function(){
			if(!canClick){
				return;
			}
			switch(position){
				case "up":
					//先选中再允许点击
					if(chosenButton==1){
						if(state_up){
							SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSCLOSE=1\r\n'));
							deviceListStrip.attr('src',"imgs/plug_off.png"); 
							state_up = false;
						}else{
							SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSOPEN=1\r\n'));
							deviceListStrip.attr('src',"imgs/plug.png"); 
							state_up = true;
						}
					}else{
						chosenButton=1;
						//chosenButton1选中
						$(".chosenButton1").css("background","#00D1DA");
						$(".chosenButton2").css("background","#A5A5A5");
					}
				break;
				case "down":
					//先选中再允许点击
					if(chosenButton==2){
						if(state_down){
							SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSCLOSE=2\r\n'));
							deviceListStrip.attr('src',"imgs/plug_off.png"); 
							state_down = false;
						}else{
							SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSOPEN=2\r\n'));
							deviceListStrip.attr('src',"imgs/plug.png"); 
							state_down = true;
						}
					}else{
						chosenButton=2;
						//chosenButton2选中
						$(".chosenButton2").css("background","#00D1DA");
						$(".chosenButton1").css("background","#A5A5A5");
					}
				break;
				case "total_on":
					console.log("totalon");
					if(!state_total_on){
						SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSOPEN=0\r\n'));
						deviceListStrip.attr('src',"imgs/total_on.png"); 
						state_total_on = true;
					}
				break;
				case "total_off":
					console.log("totaloff");
					if(!state_total_off){
						SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSCLOSE=0\r\n'));
						deviceListStrip.attr('src',"imgs/total_off.png"); 
						state_total_off = true;
					}
				break;
			}
		});
	}
}

//插排开关状态显示
function switchStripState(up,down){
	console.log("up="+up+";"+"down="+down);
	//上面一层
	if(up==1){
		$(".apply_img .strip_up").attr('src',"imgs/plug.png"); 
	}else if(up==2){
		$(".apply_img .strip_up").attr('src',"imgs/plug_off.png"); 
	}
	//下面一层
	if(down==1){
		$(".apply_img .strip_down").attr('src',"imgs/plug.png"); 
	}else if(down==2){
		$(".apply_img .strip_down").attr('src',"imgs/plug_off.png"); 
	}
	//全开全关
	if(up==1&&down==1){
		$(".apply_array .strip_switch_on").attr('src',"imgs/total_on.png"); 
		state_total_on=true;
	}else{
		$(".apply_array .strip_switch_on").attr('src',"imgs/total_on_before.png"); 
		state_total_on=false;
	}
	if(up==2&&down==2){
		$(".apply_array .strip_switch_off").attr('src',"imgs/total_off.png"); 
		state_total_off=true;
	}else{
		$(".apply_array .strip_switch_off").attr('src',"imgs/total_off_before.png"); 
		state_total_off=false;
	}
}

//添加智能设备
function addDeviceList(obj) {
	for(var j=0;j<type_.length;j++){
		console.log("type"+j+";"+type_[j]);
	}
	console.log("countcount="+count);
	var div_out = document.getElementById(obj);
	for(var i=0;i<count;i++){
		switch(type_[i]){
			case "0":
				var div = document.createElement("div");
				div.setAttribute("class","apply_array");
				var div_in = document.createElement("div");
				div_in.setAttribute("class","apply_img");
				var img = document.createElement("img");
				img.setAttribute("src","imgs/plug.png");
				img.setAttribute("class","plug");
				var label = document.createElement("label");
				label.setAttribute("class","name");
				label.innerHTML = noteList[i];
				var edit = document.createElement("input");
				edit.setAttribute("class","edit");
				edit.setAttribute("id","edit"+i);
				div_in.appendChild(img);
				div.appendChild(div_in);
				div.appendChild(edit);
				div.appendChild(label);
			break;
			case "W05":
				var div = document.createElement("div");
				div.setAttribute("class","apply_array");
			break;
			case "W04":
				var div = document.createElement("div");
				div.setAttribute("class","apply_array");
					var div_in = document.createElement("div");
					div_in.setAttribute("class","apply_img");
						//图片外包着的div
						var div_img1 = document.createElement("div");
						div_img1.setAttribute("class","div_img1");
							var img1 = document.createElement("img");
							img1.setAttribute("src","imgs/plug.png");
							img1.setAttribute("class","strip_up");
							var div_chosen1 = document.createElement("div");
							div_chosen1.setAttribute("class","chosenButton1");
						div_img1.appendChild(img1);
						div_img1.appendChild(div_chosen1);
						//图片外包着的div
						var div_img2 = document.createElement("div");
						div_img2.setAttribute("class","div_img2");
							var img2 = document.createElement("img");
							img2.setAttribute("src","imgs/plug.png");
							img2.setAttribute("class","strip_down");
							var div_chosen2 = document.createElement("div");
							div_chosen2.setAttribute("class","chosenButton2");
						div_img2.appendChild(img2);
						div_img2.appendChild(div_chosen2);
					div_in.appendChild(div_img1);
					div_in.appendChild(div_img2);
					//全关
					var img_1 = document.createElement("img");
					img_1.setAttribute("src","imgs/strip_on.png");
					img_1.setAttribute("class","strip_switch_on");
					//全开
					var img_2 = document.createElement("img");
					img_2.setAttribute("src","imgs/strip_off.png");
					img_2.setAttribute("class","strip_switch_off");
					var img_ = document.createElement("img");
					img_.setAttribute("class","base");
					img_.setAttribute("src","imgs/base.png");
				div.appendChild(div_in);
				div.appendChild(img_);
				div.appendChild(img_1);
				div.appendChild(img_2);
			break;
		}
		div_out.appendChild(div);
	}
}

//显示延时弹窗
function showExtend(Str){
	var myAlert = document.getElementById(Str); 
	myAlert.style.display = "block";  
	myAlert.style.position = "absolute";  
	myAlert.style.top = "50%";  
	myAlert.style.left = "50%";  
	myAlert.style.marginTop = (-myAlert.offsetHeight/2)+"px"; 
	myAlert.style.marginLeft = (-myAlert.offsetWidth/2)+"px"; 
	$('#mybg').show();
	$('#mybg').click(function(){
		$('#mybg').hide();
		$('#'+Str).hide();
	});
}

//恢复出厂设置
function HandleOnClose() {
	  var close = confirm("确定恢复出厂设置?");
	  if (close) {
		SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+DFT\r\n'));
		alert('设备已重置，请重新配置！');
		$('.name').html("设备离线");
		$('.name').css('color','red');
		$("#No"+currentIndex).attr('src',"imgs/plug_off.png"); 
		canClick=false;
	  }
	  else{
		window.event;
	  }
	  return message;
}

//警告
function AlertDeviceState(){
	$('.name').html("设备离线");
	$('.name').css('color','red');
	$("#No"+currentIndex).attr('src',"imgs/plug_off.png"); 
	canClick=false;
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
}

//接收数据
function RecieveToggle(Str){
	if(Str){
		$("#No"+currentIndex).attr('src',"imgs/plug.png"); 
		state = true;
	}else{
		$("#No"+currentIndex).attr('src',"imgs/plug_off.png"); 
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

//两位数
function padLeft(str){ 
	if(str >= 10) 
		return str; 
	else 
		return "0" +str; 
} 

function settingClick(e){
	e.stopPropagation();
	if(settingClickFlag==1){
		settingClickFlag=0;
		$('.setting_menu .div_img_setting_then').css('display','');
	}else{
		settingClickFlag=1;
		$('.setting_menu .div_img_setting_then').css('display','none');
	}
}

//彩灯颜色滚动条和选择块的显示控制
function lampBottomDisplay(){
	//若当前为彩灯，则显示颜色滚动条和颜色选择块
	console.log("type_l="+type);
	switch(type){
		case "0":
			$('#bright-div,#color-picker').hide();
			$('.div_img_setting_first').show();
			$('.canvas-div').hide();
			$('.sevenFlash').hide();
			$('.singleFlash').hide();
			$('.shake').hide();
			$('.power_protect').show();
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+NODE=1\r\n'));
		break;
		case "W04":
			$('.div_img_setting_first').hide();
			$('.canvas-div').hide();
			$('.sevenFlash').hide();
			$('.singleFlash').hide();
			$('.shake').hide();
			$('.power_protect').show();
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+MSNODE=1\r\n'));
		break;
		case "W05":
			$('#bright-div,#color-picker').show();
			$('.div_img_setting_first').hide();
			setTimeout("delayShow()",300);
			$('.singleFlash').show();
			$('.sevenFlash').show();
			$('.shake').show();
			$('.power_protect').hide();
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLNODE=1\r\n'));
		break;
	}
}

//延时显示用到的函数
function delayShow(){
	$('.canvas-div').show();
}
