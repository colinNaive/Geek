<?php
	error_reporting(0);
	$openid="ozcT3wn5WskYwQINmFlJYcMdbkZs";
	$conn = mysql_connect("localhost","root", "qinlu126"); 
	$sequence=1;
	if (!$conn){
		die("连接数据库失败：" . mysql_error());
	}
	mysql_select_db("smart_outlet", $conn)
	or die("dadatbase error!");
	mysql_query("set character set UTF8");
	mysql_query("SET NAMES UTF8");
	$check_query = mysql_query("select * from device_list where openid='$openid' ORDER BY id DESC limit 6");
	$index=0;
	$mac[$index]="549A11C00074";
	$note[$index]="备胎";
	$password[$index]='888888';
	$index++;
	while($result = mysql_fetch_array($check_query))
	{
		if($index==2){
			$mac[$index]="549A11C01174";
			$note[$index]="123";
			$password[$index]='888888';
		}else{
			$mac[$index] = $result['mac'];
			$note[$index] = $result['note'];
			if($result['pwd'] == ""){
				$password[$index] = '888888';
			}else{
				$password[$index] = $result['pwd'];
			}
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
<script src="js/mobiscroll_002.js" type="text/javascript"></script>
<script src="js/mobiscroll_004.js" type="text/javascript"></script>
<link href="css/mobiscroll_002.css" rel="stylesheet" type="text/css">
<link href="css/mobiscroll.css" rel="stylesheet" type="text/css">
<script src="js/mobiscroll.js" type="text/javascript"></script>
<script src="js/mobiscroll_003.js" type="text/javascript"></script>
<script src="js/mobiscroll_005.js" type="text/javascript"></script>
<link href="css/mobiscroll_003.css" rel="stylesheet" type="text/css">
<script src="js/aes.js"></script>
<script src="js/md5.js"></script>
<script src="js/pad-zeropadding.js"></script>
<script src="js/encode.js"></script>
<script type="text/javascript">
		document.getElementsByTagName('html')[0].style.fontSize=document.documentElement.clientWidth / 12 +"px";
</script>
<script src="js/shan.js" type="text/javascript"></script>
<link href="css/shan.css" rel="stylesheet" type="text/css">
<script type="text/javascript">
	//控制部分变量
	var noteList = <?php echo json_encode($note);?>;
	var count = <?php echo $index ?>;
	var note = '<?php echo $note[0];?>';
	var mac = '<?php echo $mac[0];?>'.trim();
	var passWord = '<?php echo $password[0];?>'.trim();
	var note_ = <?php echo json_encode($note);?>;
	var mac_ = <?php echo json_encode($mac);?>;	
	var password_ = <?php echo json_encode($password);?>;
	var currentIndex = <?php echo $sequence ?>;
	var openid = '<?php echo $openid ?>';
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
		<div class="apply_w " id="apply_w"></div>
	</div>
	<div class="img_r" onclick="touchclick('img_r')"><img src="imgs/right_before.png"/></div>
</div>

<div id="mybg"></div>
<!--延时输入框部分-->
<div id="alert">  
	<div class="diag_header">
		延时设置
	</div>
	<div class="diag_content">
		<input type="text" class="time_input" id="time_extend_input" value="1"/>
		<section class="box">
			<input id="check_1" class="checkbox" name="check" type="checkbox" checked>
			<label for="check_1" class="trigger"></label>
		</section>
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
		<img id="time_extend" src="imgs/time_extend_before.png" onclick="touchclick('time_extend')"/>
	</div>
	<div class="div_img_bot" >
		<input name="appTime" id="appTime" type="text" class="appTime" oninput="alert(this.value);"/>
	</div>
	<div class="div_img_bot">
		<img id="power_protect" src="imgs/power_protect_before.png" onclick="touchclick('power_protect')"/>
	</div>
</div>

</body>
</html>