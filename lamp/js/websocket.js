function connectWebsocket() {
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
			//彩灯读取状态节点
			if(output_text.indexOf("+CLNODE:#1,")!=-1){
				//有效信息起点
				var s=output_text.indexOf("+CLNODE:#1,")+11;
				var onOff = output_text[s];
				//色值起点
				var sc=s+2;
				var rgb=output_text.substring(sc,sc+6);
				//亮度起点
				var sl=sc+6;
				var light=output_text.substring(sl,sl+2);
				//状态显示
				color=rgb;
				switchFlag=onOff;
			}
			//彩灯单色闪烁与七色闪烁的响应
			if(output_text.indexOf("+CLMODE:#1,")!=-1){
				//有效信息起点
				var s=output_text.indexOf("+CLMODE:#1,")+11;
				flashLight = output_text.substring(s+6,s+8);
				flashFreq = output_text.substring(s+12,s+14);
				var rgb = output_text.substring(s,s+6);
				var mode = output_text.substring(s+9,s+11);
				//状态显示
				color=rgb;
				switchDisplay("1");
			}
			//彩灯设置颜色的响应
			if(output_text.indexOf("+CLRGB:#1,")!=-1){
				//有效信息起点
				var s=output_text.indexOf("+CLRGB:#1,")+10;
				color=output_text.substring(s,s+6);
				var sl=s+6;
				light=output_text.substring(sl,sl+2);
				console.log("color_feedback="+color+";"+"light_feedback="+light);
				switchDisplay("1");
			}
			//彩灯设置延时的响应
			if(output_text.indexOf("+CLTIMESHUT:#1,")!=-1){
				var x=output_text.indexOf("+CLTIMESHUT:#1,")+15;
				var temp=""+output_text.substring(x,output_text.size).trimRight();
				temp = temp.split(",");
				if(type=="W05"){
					if(temp[0]==0){
						$('.extend_time').show();
						$('.extend_time_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后关闭');
						$('.box').hide();
						$('.box_input').hide();
					}
					if(temp[0]==1){
						$('.extend_time').show();
						$('.extend_time_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后开启');
						$('.box').hide();
						$('.box_input').hide();
					}
					if(temp[0]==2){
						$('.box').show();
						$('.box_input').show();
						$('.extend_time').hide();
					}
				}
			}
			//插排的开关状态显示
			if(output_text.indexOf("+MSNODE:#2,")!=-1){
				//有效信息起点
				var s=output_text.indexOf("+MSNODE:#2,")+11;
				console.log("s="+s);
				var up=output_text.charAt(s);
				var down=output_text.charAt(s+2);
				console.log("updown="+output_text);
				console.log("up="+up+";"+"down="+down);
				switchStripState(up,down);
				
			}
			console.log("chapaiqianiqan");
			//插排设置延时的响应
			if(output_text.indexOf("+MSTIMESHUT:#")!=-1){
				var x=output_text.indexOf("+MSTIMESHUT:#")+15;
				var temp=""+output_text.substring(x,output_text.size).trimRight();
				temp = temp.split(",");
				if(type=="W04"){
					if(temp[0]==0){
						$('.extend_time').show();
						$('.extend_time_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后关闭');
						$('.box').hide();
						$('.box_input').hide();
					}
					if(temp[0]==1){
						$('.extend_time').show();
						$('.extend_time_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后开启');
						$('.box').hide();
						$('.box_input').hide();
					}
					if(temp[0]==2){
						$('.box').show();
						$('.box_input').show();
						$('.extend_time').hide();
					}
				}
			}
			//所有
			if(output_text.indexOf("NOLINK")!=-1){
				$('.name').html("设备离线");
				$('.name').css('color','red');
				canClick=false;
				$("#No"+currentIndex).attr('src',"imgs/plug_off.png"); 
				switchDisplay("2");//反馈开关状态
			}
			//插座
			if(output_text.indexOf("+NODE:")!=-1){
				if(sessionStorage.getItem("note")){
					note=sessionStorage.getItem("note");
				};
				$('.name').html(note);
				$('.name').css('color','#00D1DA');
				canClick=true;
				var s=output_text.indexOf("+NODE:#1,")+9;
				var plugSwitch=output_text.charAt(s);
				RecieveToggle(plugSwitch);//插座反馈开关状态
			}
			//插座
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
				if(type=="0"){
					if(temp[0]==0){
						$('.extend_time').show();
						$('.extend_time_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后关闭');
						$('.box').hide();
						$('.box_input').hide();
					}
					if(temp[0]==1){
						$('.extend_time').show();
						$('.extend_time_text').html('延时'+temp[1]+':'+padLeft(temp[2])+'后开启');
						$('.box').hide();
						$('.box_input').hide();
					}
					if(temp[0]==2){
						$('.box').show();
						$('.box_input').show();
						$('.extend_time').hide();
					}
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