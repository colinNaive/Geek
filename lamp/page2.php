<?php
	error_reporting(0);
	if (isset($_GET['openid'])){
	    $openid = $_GET['openid']; 
	}
	if (isset($_GET['sequence'])){
	    $sequence = $_GET['sequence']; 
	}
	$conn = mysql_connect("localhost","root", "qinlu126"); 
	if (!$conn){
		die("连接数据库失败：" . mysql_error());
	}
	mysql_select_db("smart_outlet", $conn)
	or die("dadatbase error!");
	mysql_query("set character set UTF8");
	mysql_query("SET NAMES UTF8");
	$check_query = mysql_query("select * from device_list where openid='$openid' ORDER BY id DESC limit 6");
	$index=0;
	while($result = mysql_fetch_array($check_query))
	{
			$mac[$index] = $result['mac'];
			$note[$index] = $result['note'];
			$password[$index] = $result['pwd'];
			$type[$index] = $result['device'];
			if($result['pwd'] == ""){
				$password[$index] = '888888';
			}
			if($result['device'] == ""){
				$type[$index] = '0';
			}
			if(strstr($mac[$index],"549A11C0017F")){
				$type[$index] = 'W04';
			}
			$index++;
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"> 
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>华凡秦鲁智能家居</title>
<meta name="description" content="">
<meta name="keywords" content="">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="renderer" content="webkit">
<meta http-equiv="Cache-Control" content="no-siteapp" />
<script src="js/jquery.1.7.2.min.js"></script>	
<script src="js/aes.js"></script>
<script src="js/md5.js"></script>
<script src="js/pad-zeropadding.js"></script>
<script src="js/encode.js"></script>
<script type="text/javascript">
		document.getElementsByTagName('html')[0].style.fontSize=document.documentElement.clientWidth / 12 +"px";
</script>
<script type="text/javascript" src="js/websocket.js"></script>
<script src="js/shan.js" type="text/javascript"></script>
<link href="css/shan.css" rel="stylesheet" type="text/css">
<script type="text/javascript">
	//控制部分变量
	var noteList = <?php echo json_encode($note);?>;
	var count = <?php echo $index ?>;
	var note = '<?php echo $note[0];?>';
	var mac = '<?php echo $mac[0];?>'.trim();
	var type = '<?php echo $type[0];?>'.trim();
	var passWord = '<?php echo $password[0];?>'.trim();
	var note_ = <?php echo json_encode($note);?>;
	var mac_ = <?php echo json_encode($mac);?>;	
	var password_ = <?php echo json_encode($password);?>;
	var type_ = <?php echo json_encode($type);?>;
	var currentIndex = <?php echo $sequence ?>;
	var openid = '<?php echo $openid ?>';
	console.log("mac___="+mac_);
	console.log("type___="+type_);
</script>
</head>

<body>
<!--头部分-->
<div class="header" >
	<div class="mode_title">当前模式</div>
	<div class="mode_content">远程</div>
	<div class="back">
		<img src="imgs/back.png" />
	</div>
</div>

<!--滑动插座部分-->
<div class="apply">
	<div class="img_l" onclick="touchclick('img_l')"><img src="imgs/left_before.png" /></div>
	<div class="apply_nav">
		<div class="apply_w " id="apply_w">
		</div>
	</div>
	<div class="img_r" onclick="touchclick('img_r')"><img src="imgs/right_before.png"/></div>
</div>

<!--彩灯绝对布局-->
<div class="canvas-div">
	<img class="switch-lamp" src="imgs/lampOn.png"/>
	<canvas id="can"></canvas>
</div>
<div id="mybg"></div>

<!--延时输入框部分-->
<div id="alert" class="alert">  
	<div class="diag_header">
		延时设置
	</div>
	<div class="diag_content">
		<!--设置延时时间-->
		<div class="box_input">
			<input type="text" class="time_input" id="time_extend_input" value="1"/>
			<label for="time_extend_input" class="min">Min</label>
		</div>
		<div class="box">
			<section class="box1">
				<input id="check_1" class="checkbox" name="check" type="checkbox" checked>
				<label for="check_1" class="trigger"></label>
			</section>
			<section class="box2">
				<img class="button_extend" id="time_extend_ok" src="imgs/extend_ok.png"/>
			</section>
		</div>
		<!--剩余延时时间-->
		<div class="extend_time">
			<label class="extend_time_text">Min</label>
			<img id="extend_cancel" class="extend_cancel" src="imgs/extend_cancel.png"/>
		</div>
	</div>
</div> 

<!--华丽的分隔符-->
<div class="clear" ></div> 

<!--颜色滚动条-->
<div class="bright-div" id="bright-div">
	<div class="slide-bar" id="slide-bar">
		<div class="slide-btn" id="slide-btn"></div>
		<div class="slide-progress" id="slide-progress"></div>
	</div>
</div>

<!--颜色选择块-->
<ul class="color-picker cl" id="color-picker">
	<li class="color-li normalLi red" data-value = "FC2429" ></li>
	<li class="color-li normalLi green" data-value = "3DFF47" ></li>
	<li class="color-li normalLi pure" data-value = "2023FC" ></li>
	<li class="color-li normalLi yellow" data-value = "FFFD27" ></li>
	<li class="color-li normalLi pink" data-value = "FE1F25" ></li>
	<li class="color-li normalLi white" data-value = "FFFFFF" ></li>
	<li class="color-li normalLi blue" data-value = "11FEFE" ></li>
</ul>

<!--单色闪烁弹窗-->
<div id="singleAlert" class="alert">  
	<div class="diag_header">
		单色闪烁
	</div>
	<div class="diag_content single_content">
		<!--颜色滚动条-->
		<div class="bright-div  bright-div-speed">
			<div class="slide-bar" id="bar-single-speed">
				<div class="slide-btn" id="btn-single-speed"></div>
				<div class="slide-progress" id="pro-single-speed"></div>
			</div>
		</div>
		<div class="bright-div">
			<div class="slide-bar" id="bar-single-light">
				<div class="slide-btn slide-btn-light" id="btn-single-light"></div>
				<div class="slide-progress" id="pro-single-light"></div>
			</div>
		</div>
		<!--颜色选择块-->
		<ul class="color-picker cl">
			<li class="color-li singleLi red color-picker-alert" data-value = "FC2429" id="singleLi"></li>
			<li class="color-li singleLi green color-picker-alert" data-value = "3DFF47" id="singleLi"></li>
			<li class="color-li singleLi pure color-picker-alert" data-value = "2023FC" id="singleLi"></li>
			<li class="color-li singleLi yellow color-picker-alert" data-value = "FFFD27" id="singleLi"></li>
			<li class="color-li singleLi pink color-picker-alert" data-value = "FE1F25" id="singleLi"></li>
			<li class="color-li singleLi white color-picker-alert" data-value = "FFFFFF" id="singleLi"></li>
			<li class="color-li singleLi blue color-picker-alert" data-value = "11FEFE" id="singleLi"></li>
		</ul>
		<!--完成按钮-->
		<img class="single_cancel" id="single_finish" src="imgs/finish.png"/>
	</div>
</div> 

<!--七色闪烁弹窗-->
<div id="sevenAlert" class="alert">  
	<div class="diag_header">
		七色闪烁
	</div>
	<div class="diag_content seven_content">
		<!--颜色滚动条-->
		<div class="bright-div bright-div-speed">
			<div class="slide-bar" id="bar-seven-speed">
				<div class="slide-btn" id="btn-seven-speed"></div>
				<div class="slide-progress" id="pro-seven-speed"></div>
			</div>
		</div>
		<div class="bright-div">
			<div class="slide-bar" id="bar-seven-light">
				<div class="slide-btn slide-btn-light" id="btn-seven-light"></div>
				<div class="slide-progress" id="pro-seven-light"></div>
			</div>
		</div>
		<!--完成按钮-->
		<img class="seven_cancel" id="seven_finish" src="imgs/finish.png"/>
	</div>
</div> 

<!--设置菜单部分-->
<div class="setting_menu">   
	<div class="div_img_setting div_img_setting_first" id="select">
		<img id="setting" src="imgs/setting_before.png"/>
	</div>
	<div class="div_img_setting div_img_setting_then div_img_setting_second" >
		<img id="reset" src="imgs/reset_before.png"/>
	</div>
	<div class="div_img_setting div_img_setting_then">
		<img id="update" src="imgs/update_before.png"/>
	</div>
	<div class="div_img_setting div_img_setting_then">
		<img id="change_psw" src="imgs/change_psw_before.png"/>
	</div>
</div>

<!--底部菜单部分-->
<div class="bottom">
	<div class="div_img_bot" >
		<img id="time_extend" src="imgs/time_extend_before.png" />
	</div>
	<div class="div_img_bot" >
		<img id="time_set" src="imgs/time_set_before.png" />
	</div>
	<div class="div_img_bot shake">
		<img id="shake" src="imgs/shake_before.png" />
	</div>
	<div class="div_img_bot singleFlash">
		<img id="singleFlash" src="imgs/singleFlash_before.png" />
	</div>
	<div class="div_img_bot sevenFlash">
		<img id="sevenFlash" src="imgs/sevenFlash_before.png" />
	</div>
	<div class="div_img_bot power_protect">
		<img id="power_protect" src="imgs/power_protect_before.png" />
	</div>
</div>

<!--彩灯JavaScript-->
<script type="text/javascript" src="js/easeljs-NEXT.min.js"></script>
<script type="text/javascript" src="js/lamp.js"></script>

</body>
</html>