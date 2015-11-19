<?php
	header("Content-type: text/html; charset=utf-8");
	if (isset($_GET['mac'])) {
		$mac = $_GET['mac'];
	}
	if (isset($_GET['passWord'])) {
		$password = $_GET['passWord'];
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport" />
		<title></title>
		<!--<script src="js/hammer.min.js"></script>-->
		<!--<script src="js/swipeout.js"></script>-->
		<!--<script src="js/jquery.min.js"></script>-->
		<script src="js/aes.js"></script>
		<script src="js/md5.js"></script>
		<script src="js/pad-zeropadding.js"></script>
		<script src="js/encode.js"></script>
		<!--<script src="js/swipeout.js"></script>-->
		<!--<script src="js/timer14.js" type="text/javascript"></script>-->	
		<script src="js/jquery.1.7.2.min.js"></script>
		<script src="js/mobiscroll_002.js" type="text/javascript"></script>
		<script src="js/mobiscroll_004.js" type="text/javascript"></script>
		<link href="css/mobiscroll_002.css" rel="stylesheet" type="text/css">
		<link href="css/mobiscroll.css" rel="stylesheet" type="text/css">
		<script src="js/mobiscroll.js" type="text/javascript"></script>
		<script src="js/mobiscroll_003.js" type="text/javascript"></script>
		<script src="js/mobiscroll_005.js" type="text/javascript"></script>
		<link href="css/mobiscroll_003.css" rel="stylesheet" type="text/css">
		<link rel="stylesheet" type="text/css" href="css/timer.css"/>
	</head>
	<body>
		<section class="main-wrap" id='main-warp'>
			<div class="header">
				<h3>定时管理</h3>
				<a  href='#' onClick="javascript :history.back(-1);">
					<img class="back" src="img/back.png" />
				</a>
			</div>
			<ul id="devlist" class="list-wrap">
			</ul>
		</section>
			<h2 id="non_device" style='display:block;text-align:center;color:#A5A5A5;'>当前无定时</h1>

			<footer class="btn-group">
			<hr color="#f3f3f3" size="1"/>
			<div class="btn">
				<input name="appTime" id="appTime" readonly="readonly" type="text" class="appTime" onfocus=" this.blur(); "/>
			</div>
		</footer>
		<!--<script src="js/fastclick.js"></script>-->
<!--		<script>new FastClick(document.body);</script>-->
		<script type="text/javascript">
			$(document).ready(function() {
//				var mac_ = '<?php echo $mac; ?>';
//				var password_ ='<?php echo $password; ?>';
//				var list = document.getElementById("devlist");
//				new SwipeOut(list, {
//					btnText: "删除"
//				});				
//				ToggleConnectionClicked(mac_,password_);
				//shan
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
			    $('#appTime').change(function(){
					var result=$('#appTime').val();
					var results= new Array(); //定义一数组 
					results=result.split('@');//分割结果
					var time=results[0].replace(/:/g,'');//处理时间
					var week=parseInt(results[1],2).toString(16);//处理星期
					var onoff=results[2];
					AddTimer(mac_,password_,onoff,week,time);
			    });
			});
		</script>
	</body>
</html>
