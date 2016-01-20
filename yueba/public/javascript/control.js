	var loading = document.getElementById("loading");
	var loading_text = document.getElementById("loading_text");
	var paging = document.getElementById("page");
	var appendDom = document.getElementById("appendDom");
	var bodyContent = document.getElementById("bodyContent");
	var lengthElem=0; 
	var more_comment_click=[];
	var zan_submit_click=[];
	var xmlHttp;
	//这个遍历添加点击事件的代码很经典！！！！！！！！！
	bindClickEvents();

	//为window创建滑动监听事件
	if(topicsLength){
		if(topicsLength<10) {
			loading.style.display = "none";
			loading_text.style.display = "none";
		}
	}
	window.addEventListener("scroll",handler);	
	//参与讨论人员头像显示控制
	headsControl();

	/******************************以下是函数部分*****************************************************/
	//为更多回复 和 点赞 绑定 点击事件
	function bindClickEvents() {
		var moreComments = document.querySelectorAll(".more_comments");
		var oneComment = document.querySelectorAll(".one_comment");
		var zanSubmits = document.querySelectorAll(".zanSubmit");
		var zanCounts = document.querySelectorAll(".zan_count");
		var comCounts = document.querySelectorAll(".com_count");
		//为每个 更多回复 绑定点击事件
		for(var i=0;i<moreComments.length;i++){
			//点赞功能相关代码
			zanSubmits[i].index=i;
			// zan_submit_click[i]=1;
			zanSubmits[i].onclick = function() {
				if(zanSubmits[this.index].getAttribute("clk") == 0) {
					//点过赞再点击就取消
					xmlHttp = GetXmlHttpObject();
					var postStr = "minute="+this.getAttribute("data-minute")+"&mix=" + this.getAttribute("data-mix") + "&cancel=" + 1;
					var url="http://127.0.0.1:3000";
					getLabelsPost(url,postStr);
					//这里只要点赞就不能再点了,没有在response里进行
					zanSubmits[this.index].setAttribute("clk",1);
					console.log("quxiaodianzan");
					zanSubmits[this.index].src="/images/zan_before.png";
					var count = parseInt(zanCounts[this.index].innerHTML);
					if(count > 0) {
						count--;
					}
					zanCounts[this.index].innerHTML = (count +"");
					console.log("zancountjian==" + count);
					return;
				}
				//发送点赞的post请求
				xmlHttp = GetXmlHttpObject();
				var postStr = "minute="+this.getAttribute("data-minute")+"&mix=" + this.getAttribute("data-mix");
				var url="http://127.0.0.1:3000";
				getLabelsPost(url,postStr);
				//这里只要点赞就不能再点了,没有在response里进行
				// zan_submit_click[this.index]=0;
				zanSubmits[this.index].setAttribute("clk",0);
				zanSubmits[this.index].src="/images/zan_after.png";
				var count = parseInt(zanCounts[this.index].innerHTML);
				count++;
				zanCounts[this.index].innerHTML = (count +"");
				console.log("zancountjia==" + count);
			}

			//点击更多回复功能相关代码
			moreComments[i].index=i;
			more_comment_click[i]=1;
			moreComments[i].onclick= function(){
				if(more_comment_click[this.index]!=1){
					//跳转
					var href=moreComments[this.index].getAttribute("data-href");
					window.location.href=href;
					return;
				}
				var ps = oneComment[this.index].getElementsByTagName("p");
				for(var i=0;i<ps.length;i++) {
					if (ps[i].style.display == "none") {
						ps[i].style.display = "block";
					}
				}
				this.innerHTML = ps.length==8?"查看更多回复":"";
				more_comment_click[this.index]=0;
			}
		}
	}

	/* 创建 XMLHttpRequest 对象 */
	function GetXmlHttpObject(){
	    if (window.XMLHttpRequest){
	      // code for IE7+, Firefox, Chrome, Opera, Safari
	      xmlhttp=new XMLHttpRequest();
	    }else{// code for IE6, IE5
	      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	    }
	    return xmlhttp;
	}

	// -----------ajax方法的post方法-----------//
	function getLabelsPost(url,postStr){
	    xmlHttp=GetXmlHttpObject();
	    if (xmlHttp==null){
	        alert('您的浏览器不支持AJAX！');
	        return;
	    }
	    xmlhttp.open("POST",url,true);
	    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    xmlhttp.send(postStr);
	}

	// -----------ajax方法的get方法-----------//
	function getLabelsGet(url){
	    xmlHttp=GetXmlHttpObject();
	    if (xmlHttp==null){
	        alert('您的浏览器不支持AJAX！');
	        return;
	    }
	    xmlhttp.open("GET",url,true);
	    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	    xmlhttp.send();
	    xmlHttp.onreadystatechange=getOkGet;//发送事件后，收到信息了调用函数
	}


	//http GET 请求成功
	function getOkGet(){
	    if(xmlHttp.readyState==1||xmlHttp.readyState==2||xmlHttp.readyState==3){
	        // 本地提示：加载中/处理中
	                                                 
	    }
	    if (xmlHttp.readyState==4 && xmlHttp.status==200){
	        var d=xmlHttp.responseText; // 返回值
	        // 处理返回值
	        if(d!=""){
	        	var appendElem = document.createElement("div");
		        appendElem.innerHTML = d;
		        bodyContent.appendChild(appendElem);
		        page++;
		        bindClickEvents();
	        }else{
	        	loading.style.display = "none";
	        	loading_text.style.display = "none";
	        	window.removeEventListener("scroll",handler,false)
	        }
	    }
	}

	//上拉滑动事件
	function handler(){
		var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
		var fold = window.innerHeight + scrolltop;
		var test = paging.offsetTop+40;
		if ( fold >= paging.offsetTop+40) {
			loading.style.display = "block";
			loading_text.style.display = "block";
			xmlHttp = GetXmlHttpObject();
			var url="http://127.0.0.1:3000?p="+page;
			if (maxTime) {
				url +=("&mt="+maxTime);
			}
			console.log("rrrrrrrrrrrrrrul="+url);
			getLabelsGet(url);
		}
	}

	//检查表单提交非空
	function checkNull() {
		if(fpost.post.value == "") {
			alert("请先填写内容哦~");
			return false;
		}
		return true;
	}

    //点击修改时间
    function changeTime() {
    	changeAlert("alert");
    }

    //显示延时弹窗
	function changeAlert(Str){
		var myAlert = document.getElementById(Str); 
		var mybg = document.getElementById("alertBg"); 
		var finish = document.getElementById("finish");
		var time_input = document.getElementById("time_input");
		var act_time = document.getElementById("act_time");
		console.log("mybg==" + mybg);
		myAlert.style.display = "block";  
		myAlert.style.position = "absolute";  
		myAlert.style.top = "50%";  
		myAlert.style.left = "50%";  
		myAlert.style.marginTop = (-myAlert.offsetHeight/2)+"px"; 
		myAlert.style.marginLeft = (-myAlert.offsetWidth/2)+"px"; 
		mybg.style.display = "block";
		mybg.onclick = function(){
			mybg.style.display = "none";
			myAlert.style.display = "none";
		};
		finish.onclick = function() {
			if(time_input.value == "") {
				alert("时间值为空");
				return;
			}
			console.log("dianjibutton");
			//发送修改activity表的time的post请求
			xmlHttp = GetXmlHttpObject();
			var postStr = "activityId="+activityId+"&content=" + time_input.value;
			var url="http://127.0.0.1:3000";
			getLabelsPost(url,postStr);
			mybg.style.display = "none";
			myAlert.style.display = "none";
			act_time.innerHTML = time_input.value;
			console.log("act_time.innerHTML=" + act_time.innerHTML);
		};
	}

	/*参与讨论人员头像显示控制*/
	function headsControl() {
		var heads = document.querySelectorAll(".head_control");
		var text = document.querySelector(".member .text");
		var dot = document.querySelector(".dot");
		var member = document.querySelector(".member");
		console.log("text_width==" + text.offsetWidth);

		//计算屏幕宽度
		var bodyWidth = document.body.clientWidth;
		console.log("bodyWidth=" + bodyWidth);

		//计算剩余宽度多大(左边距 左图大小 左图右边距 文字大小 三个点大小 右边距)
		var restWidth = bodyWidth - 15 -22 - 10 - text.offsetWidth - 18 - dot.offsetWidth;
		console.log("restWidth=" + restWidth);

		//计算能摆放个数
		var count = Math.floor(restWidth/38);
		console.log("coiunt===" + count);

		//三个点的显示控制
		controlDisplayDot(dot, heads, count, restWidth);

		//头像个数的显示控制
		controlDisplayHeads(heads,count);

		if(count < heads.length) {
			var flagClick =false;
			member.onclick = function() {
				if (flagClick == false) {
					flagClick =true;
					for(var j=0; j<heads.length; j++) {
						heads[j].style.display = "block";
					}
					dot.style.display = "none";
				}else {
					flagClick =false;
					for(var j=0; j<heads.length; j++) {
						if (j >= count) {
							heads[j].style.display = "none";
						}
					}
					//三个点的显示控制
					controlDisplayDot(dot, heads, count, restWidth);
				}
			}
		}

	}

	//头像个数的显示控制
	function controlDisplayHeads(heads, count) {
		for(var i=0;i<heads.length;i++) {
			if(i < count){
				heads[i].style.display = "block";
			}else {
				heads[i].style.display = "none";
			}
		}
	}

	//三个点的显示控制
	function controlDisplayDot(dot, heads, count, restWidth) {
		console.log("countdot=" + count);
		console.log("restWidth=" + restWidth);
		var realWidth = count > heads.length ? heads.length : count;
		if(count < heads.length && restWidth - realWidth * 38 > dot.offsetWidth) {
			console.log("blockblockblock");
			dot.style.display = "block";
		}else {
			console.log("nonenonenonenone");
			dot.style.display = "none";
		}
	}
