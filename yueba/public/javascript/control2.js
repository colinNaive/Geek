  var bodyContent = document.getElementById("bodyContent");
  var xmlHttp;
  //这个遍历添加点击事件的代码很经典！！！！！！！！！
  bindClickEvents();

  /******************************以下是函数部分*****************************************************/
  //为更多回复 和 点赞 绑定 点击事件
  function bindClickEvents() {
    var zanSubmit = document.querySelector(".zanSubmit");
    var zanCount = document.querySelector(".zan_count");
      //点赞功能相关代码
      zanSubmit.onclick = function() {
        if(zanSubmit.getAttribute("clk") == 0) {
          //点过赞再点击就取消
          xmlHttp = GetXmlHttpObject();
          var postStr = "minute="+this.getAttribute("data-minute")+"&mix=" + this.getAttribute("data-mix") + "&cancel=" + 1;
          var url="http://121.42.163.74:3000";
          getLabelsPost(url,postStr);
          //这里只要点赞就不能再点了,没有在response里进行
          zanSubmit.setAttribute("clk",1);
          console.log("quxiaodianzan");
          zanSubmit.src="/images/zan_before.png";
          var count = parseInt(zanCount.innerHTML);
          console.log("zan_before_count==" + zanCount.innerHTML);
          if(count > 0) {
            count--;
          }
          zanCount.innerHTML = (count +"");
          console.log("zancountjian==" + count);
          return;
        }
        //发送点赞的post请求
        xmlHttp = GetXmlHttpObject();
        var postStr = "minute="+this.getAttribute("data-minute")+"&mix=" + this.getAttribute("data-mix");
        var url="http://121.42.163.74:3000";
        getLabelsPost(url,postStr);
        //这里只要点赞就不能再点了,没有在response里进行
        zanSubmit.setAttribute("clk",0);
        zanSubmit.src="/images/zan_after.png";
        console.log("zan_after_count==" + zanCount.innerHTML);
        var count = parseInt(zanCount.innerHTML);
        count++;
        zanCount.innerHTML = (count +"");
        console.log("zancountjia==" + count);
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

  //检查表单提交非空
  function checkNull() {
    if(fpost.post.value == "") {
      alert("请先填写内容哦~");
      return false;
    }
    return true;
  }
