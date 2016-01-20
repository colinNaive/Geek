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
	if(topicsLength!=undefined){
		if(topicsLength<10) {
			paging.style.display = "none";
		}
	}
	window.addEventListener("scroll",handler);		


	/******************************以下是函数部分*****************************************************/
	//为更多回复 和 点赞 绑定 点击事件
	function bindClickEvents() {
		var moreComments = document.querySelectorAll(".more_comments");
		var oneComment = document.querySelectorAll(".one_comment");
		var zanSubmits = document.querySelectorAll(".zanSubmit");
		//为每个 更多回复 绑定点击事件
		for(var i=0;i<moreComments.length;i++){
			//点赞功能相关代码
			zanSubmits[i].index=i;
			zan_submit_click[i]=1;
			zanSubmits[i].onclick = function() {
				if(zan_submit_click[this.index]!=1) {
					//点过赞不能再点赞了
					return;
				}
				//发送点赞的post请求
				xmlHttp = GetXmlHttpObject();
				var postStr = "minute="+this.getAttribute("data-minute");
				var url="http://127.0.0.1:3000";
				getLabelsPost(url,postStr);
				//这里只要点赞就不能再点了,没有在response里进行
				zan_submit_click[this.index]=0;
				zanSubmits[this.index].src="/images/favicon.ico";
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
				/*//得到该item下的所有评论 包括 起点 和 长度
				for(var k=0;k<this.index;k++){
					//必须要转化为int类型再相加
					lengthElem+=parseInt(eleLengthArray[k]);//得到起点
				}
				//起点 +1 因为 滤除第一条评论
				lengthElem+=1;
				//得到长度
				var partLength=lengthElem+parseInt(eleLengthArray[this.index]);
				//长度 -1 因为 滤除第一条评论
				partLength-=1;
				//从 commentJsonArray 中得到 相应评论 加载到html中
				for(var q=lengthElem;q<partLength;q++){
					oneComment[this.index].innerHTML+=('<p>'+commentJsonArray[q]+'</p>');
				}
				moreComments[this.index].innerHTML=eleLengthArray[this.index]==8?"查看更多回复":"";
				//长度清零
				lengthElem=0;*/
				//使得该帖子不得再点击加载
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
		        // console.log("commentJsonArray="+commentJsonArray);
	        }else{
	        	paging.style.display = "none";
	        	window.removeEventListener("scroll",handler,false)
	        }
	    }
	}

	//上拉滑动事件
	function handler(){
		var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
		var fold = window.innerHeight + scrolltop;
		var test = paging.offsetTop+40;
		console.log("test="+test);
		console.log("fole="+fold);
		if ( fold >= paging.offsetTop+40) {
			paging.style.display = "block";
			xmlHttp = GetXmlHttpObject();
			var url="http://127.0.0.1:3000?p="+page;
			console.log("url="+url);
			getLabelsGet(url);
		}
	}