var totalPage;
var page = 0;
//注册前台页面监听事件
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
		totalPage = $("input[name=totalPage]").val();
		console.log("totalPage----------" + totalPage);
		//console.log("msg----------contentscript.js" + request.greeting);
		getOrderInfo( sendResponse );
});

//获取订单信息
function getOrderInfo( sendResponse ){
	var flag = false;
	
	payMoney = [];//货款金额
	orderTime = [];//下单时间
	$("tr[class=head] span").each(function(index){
		spantxt = '';
		spantxt = $(this).text();
		if(spantxt.indexOf('货款金额：') > -1){
			money = spantxt.substr(5);
			//console.log(index + "---------payMoney-------货款金额：" + money);
			payMoney.push(money);
		}else if(spantxt.indexOf('下单时间：') > -1){
			time = spantxt.substr(5);
			//console.log(index + "---------orderTime-------下单时间：" + time);
			orderTime.push(time);
		}
	});
	
	paytype = [];//物流方式
	yunfei = [];//运费
	$("td[class=p-values]").each(function(index){
		tdtxt = '';
		tdtxt = $(this).text();
		if(tdtxt.indexOf('货到付款') > -1){
			paytype.push('货到付款');
		}else{
			paytype.push('在线支付');
		}
		
		yf_index = tdtxt.indexOf('运费:');
		if(yf_index > -1){
			temp = tdtxt.substr(yf_index);
			temp_yf = temp.substr(3);
			//console.log(index + "---------yunfei-------"+ temp +"===" + temp_yf);
			yunfei.push(temp_yf);
		}else{
			yunfei.push(0);
		}
		
		//console.log(index + "---------tdtxt-------" + tdtxt);
	});
	
	orderStatus = [];//订单状态
	users = [];//买家账号
	remark = [];//备注
	$("tr[class=content] td[class=t-c]").each(function(index){
		tdtxt = '';
		tdtxt = $(this).text().replace(/[\r\n]\ +/g,"");//将回车，换行，空格去掉
		temp = index % 5;
		if(1 == temp){
			orderStatus.push(tdtxt);
			//console.log(index + "---------statu-------" + tdtxt);
		}else if(2 == temp){
			users.push(tdtxt);
			//console.log(index + "---------users-------" + tdtxt);
		}else if(3 == temp){
			remark.push(tdtxt);
			//console.log(index + "---------remark-------" + tdtxt);
		}
	});
	
	express = [];//快递单号
	$("tr[class=content] td div[style='text-align: center;']").each(function(index){
		tdtxt = '';
		tdtxt = $(this).text().replace(/[\r\n]\ +/g,"");//将回车，换行，空格去掉
		express.push(tdtxt);
		//console.log( "============快递单号=======" + tdtxt);
	});
	
	orderInfo = [];
	splitstr = "@_@";
	$("tr[class=head] a[track=orderinfopagebeta]").each(function(index){
		orderid = $(this).text();
		//console.log("---------orderid-------" + orderid);
		mycomment = $("a[id=comment_" + orderid + "]").attr('style').replace(/[\r\n]\ +/g,"");
		if("display: block;" == mycomment){
			mycomment = '已评价';
		}else if('display:none;' == mycomment){
			mycomment = '未评价';
		}
		
		tempshopid = $("img[id=remarkFlag_" + orderid + "]").attr('onclick');
		shopidIndex = tempshopid.indexOf(",");
		shopid = tempshopid.substr(shopidIndex + 1).replace(/[\)\;]/g,"");
		//console.log("---------shopid-------" + shopid);
		orderdesc = shopid  + splitstr + orderid + splitstr + mycomment + splitstr + payMoney[index] + splitstr + orderTime[index] + splitstr + paytype[index] + splitstr + yunfei[index] + splitstr + orderStatus[index] + splitstr + users[index] + splitstr + remark[index] + splitstr + express[index];
		console.log("---------orderdesc-------" + orderdesc);
		orderInfo.push(orderdesc);
	});
	
	//chrome.extension.sendMessage({"orderInfo": orderInfo}, function(response) {});
	page = parseInt($("a[class=current]").text());
	totalPage = parseInt($("input[name=totalPage]").val());
	console.log(page + "--page-----------totalPage---" + totalPage);
	if(page < totalPage && page < 100){
		console.log("---------next-------");
		sendMsg( orderInfo, "next" );
		$('a.next')[1].click();
	}else{
		console.log("---------end-------");
		sendMsg( orderInfo, "end" );
	}
	//

}

//将获取内容传递给后台文件进行处理
function sendMsg( msg, cmd){
	chrome.extension.sendMessage({"msg": msg, "cmd": cmd}, function(response) {});
}

