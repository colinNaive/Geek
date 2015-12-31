	var moreComments = document.querySelectorAll(".more_comments");
	var oneComment = document.querySelectorAll(".one_comment");
	var lengthElem=0;
	var more_comment_click=[];
	//这个遍历添加点击事件的代码很经典！！！！！！！！！
	//为每个 更多回复 绑定点击事件
	for(var i=0;i<moreComments.length;i++){
		moreComments[i].index=i;
		more_comment_click[i]=1;
		moreComments[i].onclick= function(){
			if(more_comment_click[this.index]!=1){
				//跳转
				return;
			}
			//得到该item下的所有评论 包括 起点 和 长度
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
			lengthElem=0;
			//使得该帖子不得再点击加载
			more_comment_click[this.index]=0;
		}
	}
	