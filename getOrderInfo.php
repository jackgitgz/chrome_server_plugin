<?php
header("Content-type:text/html; charset=utf-8");
 //include("./includes/global.php");
 echo "***********************";
 $con = mysql_connect("localhost","root","root");
echo "==============";
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
  mysql_select_db("test", $con);
  //var_dump($_REQUEST);
  $orderinfo   = $_POST['orderinfo'];
  $orderArr = explode('#$#', $orderinfo);
  print_r($orderArr);
  $sql_value = array();
  $split = "', '";
  foreach($orderArr as $myorder){
	$value = explode('@_@', $myorder);
	echo "===========" . $value[10] ."</br>";
	$sql = "INSERT INTO test (venderId, orderid, pingjia, money, ordertime, paytype, yunfei, orderstatu, user, remark, express) VALUES ";
	$sql .= "('" . $value[0] . $split . $value[1] . $split . $value[2] . $split . $value[3] . $split . $value[4] . $split . $value[5] . $split . $value[6] . $split . $value[7] . $split . $value[8] . $split . $value[9] . $split . $value[10] . "')  ON DUPLICATE KEY UPDATE remark = '" . $value[9] . "', pingjia = '" . $value[2] . "', orderstatu = '" . $value[7] . "', express = '" . $value[10] . "'";
	mysql_query($sql);
  }
echo $sql . "</br>";
?>
