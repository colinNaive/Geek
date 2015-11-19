var settingClickFlag=1;
var canClick=true;
$(function(){
	$("#appTime").click(function(){
		if($('.name').css("color")=="rgb(0, 209, 218)"){
			window.location.href="http://www.shuworks.com/HFQL/smart/timer.php?mac="+mac+"&passWord="+passWord;
		}else{
			alert("该设备离线");
		}
	});
    //添加设备列表
    addDeviceList('apply_w');
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
	$('.edit').css("display","none");
	//默认隐藏
	$('.box_input').hide();
	$('.box').hide();
	$('.extend_time').hide();
	lampBottomDisplay();//彩灯颜色滚动条和颜色选择块的显示控制
	var time_extend=1,time_set=1,power_protect=1;
	//插座按钮状态
	var state = false;
	var output = 'CONTROL ' + mac + ' P ' + passWord + ' AT+TIMETASK=1,';
	var ws;
	var editpass;
	var lc1 = currentIndex;
	var rc1 = $li1.length-1-currentIndex;
	var currentLocation=0;
	//websocket连接
	connectWebsocket();
	/*******插座部分控制*********/
	var deviceList=$('.apply_array .apply_img img');
	//初始化设备mac、note、password、type
	mac=mac_[currentIndex].trim();
	note = note_[currentIndex];
	passWord = password_[currentIndex].trim();
	type = type_[currentIndex].trim();
	//初始化当前设备位置
	currentLocation= 6.8*currentIndex;
	$window1.animate({left:'-='+currentLocation+'rem'}, 1);
	for(var i=0;i<deviceList.length;i++){
		deviceList[i].id="No" + i;
	}
	/*******插座部分控制*********/
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
	//左右位置移动
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
		passWord = password_[currentIndex].trim();
		SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+NODE=1\r\n'));
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
		passWord = password_[currentIndex].trim();
		SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+NODE=1\r\n'));
		lampBottomDisplay();//彩灯颜色滚动条和颜色选择块的显示控制
	});
	
	/* 弹窗 */
	$('#time_extend').click(function(){
		if($('.name').css("color")=="rgb(0, 209, 218)"){
			$(".box_input,.box,.extend_time").hide();//显示之前先全部隐藏
			showExtend("alert");//延时弹窗显示
			console.log("type_exten="+type);
			if(type=="plug"){
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+TIMESHUT=1?\r\n'));
			}else if(type=="lamp"){
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLTIMESHUT=1?\r\n'));
			}
		}else{
			alert("该设备离线");
		}
	});
	//关闭延时
	$('#extend_cancel').click(function(){
		$('#mybg,#alert,.extend_time').hide();
		if(type=="plug"){
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+TIMESHUT=1,2,0\r\n'));
		}else if(type=="lamp"){
			SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLTIMESHUT=1,2,0\r\n'));
		}
	});
	//恢复出厂设置点击
	$('#reset').click(function(e){
		e.stopPropagation();
		if($('.name').css("color")=="rgb(0, 209, 218)"){
			HandleOnClose();
		}else{
			alert("该设备离线");
		}
	});
	$('#change_psw').click(function(e){
		e.stopPropagation();
		if($('.name').css("color")!="rgb(0, 209, 218)"){
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
			if(type=="plug"){
				console.log("chazuodianji");
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+TIMESHUT=1,' + delay_switch + ',' + delay_long + '\r\n'));
			}else if(type=="lamp"){
				console.log("caidengdianji");
				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLTIMESHUT=1,' + delay_switch + ',' + delay_long + '\r\n'));
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
		$('.edit').val(note);
		$('#edit'+currentIndex).focus();
		$('.bottom').css("display","none");
		$('.setting_menu').css("display","none");
	});
	$('.edit').blur(function(){
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
	});
});

/***************************************以下为子函数部分*******************************************/
function addDeviceList(obj) {
	for(var j=0;j<type_.length;j++){
		console.log("type"+j+";"+type_[j]);
	}
	var div_out = document.getElementById(obj);
	for(var i=0;i<count;i++){
		switch(type_[i]){
			case "plug":
				var div = document.createElement("div");
				div.setAttribute("class","apply_array");
				var div_in = document.createElement("div");
				div_in.setAttribute("class","apply_img");
				var img = document.createElement("img");
				img.setAttribute("src","imgs/plug.png");
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
			case "lamp":
				var div = document.createElement("div");
				div.setAttribute("class","apply_array");
			break;
			case "strip":
			
			break;
		}
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
					SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLNODE=1\r\n'));
					num++;
					break;	
			}
			if(output_text.indexOf("+NODE:#1,")!=-1){
				console.log("result_test="+output_text);
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
				$('.name').html("设备离线");
				$('.name').css('color','red');
				canClick=false;
				$("#No"+currentIndex).attr('src',"imgs/plug_off.png"); 
			}
			if(output_text.indexOf("+NODE:")!=-1){
				if(sessionStorage.getItem("note")){
					note=sessionStorage.getItem("note");
				};
				$('.name').html(note);
				$('.name').css('color','#00D1DA');
				canClick=true;
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
					$('.extend_time').show();
					$('.extend_time_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后关闭');
				}
				if(temp[0]==1){
					$('.extend_time').show();
					$('.extend_time_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后开启');
				}
				if(temp[0]==2){
					$('.box').show();
					$('.box_input').show();
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
			if(output_text.indexOf("+V:")!=-1){
				console.log("banben="+output_text);
				var x=output_text.indexOf("+V:")+3;
				var temp=""+output_text.substring(x,output_text.size).trimRight();
				console.log("banbenhao="+temp+'@End');
//				SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+UPDATE='+temp+'\r\n'));
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
//	alert("jinggao");
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
	if(currentIndex==1){
		$('#bright-div,#color-picker').show();
		$('.div_img_setting_first').hide();
		setTimeout("delayShow()",300);
		$('.singleFlash').show();
		$('.sevenFlash').show();
		SendData(Encrypt('CONTROL ' + mac + ' P ' + passWord + ' AT+CLNODE=1\r\n'));
	}else{
		$('#bright-div,#color-picker').hide();
		$('.div_img_setting_first').show();
		$('.canvas-div').hide();
		$('.sevenFlash').hide();
		$('.singleFlash').hide();
	}
}

//延时显示用到的函数
function delayShow(){
	$('.canvas-div').show();
}
