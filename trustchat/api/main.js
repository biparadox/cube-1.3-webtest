var sessionList=[
/*{id:1,name:"会话1",photo:"./dist/images/3.jpg"},		//sessionList实例，最后清空
{id:2,name:"会话2",photo:"./dist/images/3.jpg"},*/
];

var currentSessionID="平台助手";					//当前会话


var messageLog=[				//只存本次网页打开后的messageLog，正在考虑要不要存放在某个文档里,还有图片路径要不要换成id之类的得和后台相关
	/*{time:"9:31",user:"YYC",photo:"./dist/images/1.jpg",msg:"Hello"},*/
	//{time:"9:31",user:"平台助手",photo:"./dist/images/2.jpg",msg:"Hello"},
];

function initwebchat(msg){				//文档加载后执行，类似main函数

	/*msg.RECORD[0].user*/



	//从后端获取本人头像的地址并输出
	$('header img.avatar').attr("alt",window.curr_user);		//alt是说明,不出现在页面但是很重要，和用户名相同即可
	$('header img.avatar').attr("src","./dist/images/1.jpg");		//src是用户头像地址
	$('header p').html(window.curr_user);						//真‘用户名


	//此处需通过服务端获取sessionList


	//此处需通过服务端获取24小时以内历史信息，并插入messageLog





	for(var i=0;i<msg.RECORD.length;i++){
	//以下为添加会话（用户，并非等同messageLog，左侧栏）的方法举例，注意，id不要重复，尽量递增状态
		var jsonstr={id:i,name:msg.RECORD[i].user,photo:"./dist/images/3.jpg"}; //网页上会话3是动态添加实例
		sessionList.push(jsonstr);
	}



	for(var i=0;i<sessionList.length;i++){			//根据sessionList输出到界面
		addSession(sessionList[i]);
	}

	showMsgLog();


}; 


$(document).on('keydown', 'textarea', function(e) {			//针对textarea的ctrl+Enter输入进行操作
  if(e.keyCode == 13 && e.ctrlKey) {
      var context = $('textarea').val()
    if(context!=""){     //获取输入值不为空
    	//此处应发送用户输入的文字到本地app并获得成功返回后添加(push)到messageLog里面
         var message_info = {sender:window.curr_user,msg:context};
  //          createSelfmsg("","./dist/images/1.jpg", message_info.msg);
         createSelfmsg("","./dist/images/1.jpg",'@'+message_info.receiver+''+message_info.msg);

        var msg = new Cube_msg("CRYPTO_DEMO","CHAT_MSG");
        msg.addrecord(message_info);
        alert(msg.output());
        window.wsock.send(msg.output())

       //createSelfmsg("21:30","./dist/images/1.jpg",$('textarea').val());	//本端发送示例
       //createOthmsg("7:02","./dist/images/2.jpg",$('textarea').val());	   //对方发送示例，不是放在此处的，仅为示例

       $('textarea').val("");		//成功发送后清空输入栏
    }
  }
});

function cleanBoard(){				//清空对话框
	$('.m-message ul').html("");
}
function bindSessionListClick(flag){					//sessionList对应的捆绑点击事件
	if(flag==true){										
		$("div.m-list ul li").click(function(){			//内含切换调整会话对象
			if($(this).attr("class")!="active"){
				cleanBoard();
				//输出新的会话对象（sessionList中的）名字，根据名字去找记录，刷新（意味着要清空，直接=[]就清空了）messageLog
				//以下是示例获取对象名字：$(this).find('p').html()
				console.log($(this).find('p').html());  
			
			}
			$("div.m-list ul li").attr("class","");
			$(this).attr("class","active");

			//此处修改currentSessionId
			currentSessionID=$("div.m-list ul li.active p").html();

			//输出messageLog内容
			showMsgLog();
		});
	}
	else if(flag==false){
		$("div.m-list ul li").unbind('click');
	}
}

function showMsgLog(){			//根据当前messageLog输出
	for(var i=0;i<messageLog.length;i++){
		if(messageLog[i].user!=$('header p').html()){
			createOthmsg(messageLog[i].time,messageLog[i].photo,messageLog[i].msg);
		}
		else{
			createSelfmsg(messageLog[i].time,messageLog[i].photo,messageLog[i].msg);
		}
	}
}


function addSession(sessionListUnit){						//根据传递的Sessionlist的内容创建新的会话到屏幕

	bindSessionListClick(false);						//添加时取消绑定
	var li=document.createElement("li");
	li.className="";
	var img=document.createElement("img");
	img.width="30";
	img.height="30";
	img.className="avatar";
	img.alt=sessionListUnit.name;
	img.src=sessionListUnit.photo;
	
	var page=document.createElement("p");
	page.className="name";
	page.innerHTML=sessionListUnit.name;

	li.appendChild(img);
	li.appendChild(page);
	$('.m-list ul').append(li);

    var option=document.createElement("option");
    option.text=sessionListUnit.name;
    option.value=sessionListUnit.name;
    var select=document.getElementById('priv_chat');
    select.add(option);
	bindSessionListClick(true);					//添加后恢复绑定
}


function createSelfmsg(time,userPic,userinput){				//创造自己发出的msg添加到输出
	var li=document.createElement("li");

	var ptime=document.createElement("p");
	ptime.className="time";

	var spantime=document.createElement("span");
	spantime.innerHTML=time;					
	ptime.appendChild(spantime);

	var maindiv=document.createElement("div");
	maindiv.className="main self";

	var maindivimg=document.createElement("img");
	maindivimg.width="30";
	maindivimg.height="30";
	maindivimg.className="avatar";
	maindivimg.src=userPic;					//使用者的头像

	var maindivdiv=document.createElement("div");
	maindivdiv.className="text";
	maindivdiv.innerHTML=userinput;			

	maindiv.appendChild(maindivimg);
	maindiv.appendChild(maindivdiv);
	li.appendChild(ptime);
	li.appendChild(maindiv);
	$('.m-message ul').append(li);
	$('.m-message').scrollTop($('.m-message')[0].scrollHeight);
}

function createOthmsg(time,userPic,userinput){				//创建别人发出的msg添加到输出
	var li=document.createElement("li");

	var ptime=document.createElement("p");
	ptime.className="time";

	var spantime=document.createElement("span");
	spantime.innerHTML=time;							//时间
	ptime.appendChild(spantime);

	var maindiv=document.createElement("div");
	maindiv.className="main";

	var maindivimg=document.createElement("img");
	maindivimg.width="30";
	maindivimg.height="30";
	maindivimg.className="avatar";
	maindivimg.src=userPic;				//发消息的人的头像

	var maindivdiv=document.createElement("div");
	maindivdiv.className="text";
	maindivdiv.innerHTML=userinput;			//用户输入内容

	maindiv.appendChild(maindivimg);
	maindiv.appendChild(maindivdiv);
	li.appendChild(ptime);
	li.appendChild(maindiv);
	$('.m-message ul').append(li);
	$('.m-message').scrollTop($('.m-message')[0].scrollHeight);
}