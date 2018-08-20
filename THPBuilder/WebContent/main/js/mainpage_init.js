
var filldata = function(){
    this.init();
}

filldata.prototype.init = function(argument){
    // body...
    this.getstatus();
    //this.getcount();
    this.getRecent();
    //this.getTrend();
    //this.getShare();
    
};

filldata.prototype.getcount = function(argument){
    // body...
    $.get("/THPBuilder/item_count", {}, function(data){
            //console.log(data);
            $('#block-user-left > div.area-extra > a:nth-child(2) > span.pts').text(data.data.mine);
            $('#block-user-left > div.area-extra > a:nth-child(3) > span.pts').text(data.data.module);
            $('#block-user-left > div.area-extra > a:nth-child(4) > span.pts').text(data.data.followcount);
            $('#block-user-left > div.area-extra > a:nth-child(5) > span.pts').text(data.data.fanscount);
        });
};

filldata.prototype.getstatus = function(argument){
    // body...
	var user_unique_id ;
    $.get(
    	"/THPBuilder/login_status", 
    	{}, 
    	function(result){
	        if(result.is_login){
	            user_unique_id = result.id;
	            $("#to_login_div").hide();
	            $("#user_menu").show();
	            $("#area-main-left").show();
	            $("#block-banner-right").show();
	            $("#username_span").text(result.username);
	            $("#head_portrait_a").attr("src", result.head_portrait);
	            
	            var update_href = function(a){
	                var href = a.attr("href");
	                href = href + result.id + "/";
	                a.attr("href", href);
	            };
	
	            //daovoice init
	            /*
	            daovoice('init', {
	              app_id: "abcfe652",
	              user_id: result.id, // 必填: 该用户在您系统上的唯一ID
	              email: result.email, // 选填:  该用户在您系统上的主邮箱
	              name: result.username, // 选填: 用户名
	              signed_up: result.signuptime, // 选填: 用户的注册时间，用Unix时间戳表示
	              secure_digest:result.secure_digest//app secure_digest
	            });
	            daovoice('update');
	            */
	
	        }
	        else{

                window.location.href=result.href;
                
                
//	            $("#to_login_div").hide();
//	            $("#area-main-left").hide();
//	            $("#block-banner-right").hide();
//	            $("#newlink").hide();	            
//	            $("#user_menu").hide();
	            
	            
	            /*
	            daovoice('init', {
	              app_id: "thpower12345"
	            });          
	            */
	            //daovoice('update');
	        }
	
	        var left = ($("#user_menu").width() - 170);
	        var ml = -15 - ($("#user_menu").width() - 170);
	        $("#user_menu").css("margin-left", ml + "px");
	        $("#user_menu").css("position", "relative");
	       // $("#user_menu").css("left", left + "px");
	       
	    }, 
    	'json'
    );
};

filldata.prototype.getRecent = function(argument){
    $.get(
    	"/THPBuilder/get_recent", 
  		{userid: "1"}, 
    	function(data){
  			
	        //console.log(data);
  			var jsonProject = JSON.stringify(data);
			localStorage.setItem("thpcloud.projects", jsonProject);
			
	        if (data.total==0){
	           //var info = $('<li>'+gettext('147')+'<a href="/THPBuilder/editor.html" style="font-size:22px;color: #599ad2;">'+gettext('148')+'</a>。</li>');
	           var info = $('<li>'+gettext('147')+gettext('148')+'。</li>');
	           $('#recent > ul').append(info);
	        }else{
	            for (var x = 0; x<data.data.length;x++){
	                if(data.data[x].type != ''){
	                    var info = $('<li><i class="glyphicon glyphicon-book"></i>'
	                    		+'<a href="/THPBuilder/editor.html?proid='+ data.data[x].id +'">'+data.data[x].name+'</a>'
	                    		+'<span style="float: right;">'
	                    		+'<a href="/THPBuilder/views.html?proid='+ data.data[x].id +'"><i class="fa fa-eye fa-fw"></i>&nbsp;浏览&nbsp;&nbsp; </a> '
	                    		+'<a href="/THPBuilder/editor.html?proid='+ data.data[x].id +'"><i class="fa fa-edit fa-fw"></i>&nbsp;编辑&nbsp;&nbsp;</a> '
	                    		+'<a href="/THPBuilder/editor.html?proid='+ data.data[x].id +'"><i class="fa fa-trash fa-fw"></i>&nbsp;删除&nbsp;&nbsp;</a> '
	                    		//+'<a>删除</a>'
	                    		+'</span></li>');
	                    $('#recent > ul').append(info);
	                }else {
	                    var info = $('<li><i class="glyphicon glyphicon-book"></i><a href="/THPBuilder/editor.html?proid='+ data.data[x].id +'">'+data.data[x].name+'</a></li>');
	                    $('#recent > ul').append(info);
	                }
	            }
	        }
	        
	        $('<li><i class="glyphicon glyphicon-file"></i>最近打开的文档：<a href="/editor?id=22">Hchen_test2</a></li>');

  		},
  		'json'
  	);
};
filldata.prototype.getTrend = function(argument){

     $.get("/THPBuilder/share/myfollowlist?pagesize=5&page=1", {}, function(data){
        if(data.success){
            if(data.simulations.length == 0){
                var info = $('<li>'+gettext('151')+'</li>');
                $('#trend > ul').append(info);
            }else {
                for(var x =0 ;x <data.simulations.length;x++){
                    var info =$('<li><i class="glyphicon glyphicon-user"></i><a href="documents?cid='+data.simulations[x].user_id+'"> '+data.simulations[x].user+'</a>'+gettext('72')+'<a href="/shareResult/'+data.simulations[x].doc_no+'">'+data.simulations[x].title+'</a></li>');
                    $('#trend > ul').append(info);
                }
            }
        }
     });

};
filldata.prototype.getShare = function(argument){
    // body...
    $.get("/THPBuilder/listsharedata/?page=1&pagesize=5&type=mine", {}, function(data){
        if(data.success){
            if(data.simulations.length == 0){
                var info = $('<li>'+gettext('152')+'</li>');
                $('#share > ul').append(info);
            }else {
                for(var x =0 ;x <data.simulations.length;x++){
                    var info =$('<li><i class="glyphicon glyphicon-user"></i><a href="documents?cid='+data.simulations[x].user_id+'"> '+data.simulations[x].user+'</a> 分享了文档：<a href="/shareResult/'+data.simulations[x].doc_no+'">'+data.simulations[x].title+'</a></li>');
                    $('#share > ul').append(info);
                }
            }
        }
    });
};
filldata.prototype.getPopular = function(argument){
    // body...
};


//init
(function(){
	
	new filldata();

	var option = {
        success: function(re) {
        	if (re.success) {	
        		
                   //window.location.href=re.url;	               	
                   
                   $("#createform").hide(); 
                   
                   return false;	                   
               } else {
                   $('#nameerrors').text('创建失败！');
                   //window.location.href=re.url;	                   
                   return false;
               }
        },
        error: function(re) {
        	console.log(re);	            
            return false;
        },
        dataType: 'json'
	}

    $('#createBtn').click(function() {
    	
    	var pat=new RegExp("[^a-zA-Z0-9\_\u4e00-\u9fa5]", "i");   
        var strTest = trim($("#pname").val());
        if(strTest=="" )
    	{
        	$('#nameerrors').text("请输入名称");   
        	return false;   
    	}
        
        if(pat.test(strTest)==true)   
        {   
        	$('#nameerrors').text("名称含有非法字符");   
            return false;   
        }
        
 		//$('#createform').ajaxSubmit(option);
        
        var proname = $('#pname').val();
        var prodescription= $('#pdesc').val();
        var protype= $('#ptype').val();      
        
        $.ajax({
        	type : 'POST',
			url : "createProject",
			data:{proname: proname , prodescription: prodescription, protype: protype },
			dataType : 'json',
			async : true,
	        success: function(data, textStatus) {
	        	if (textStatus=="success") {
	        		
	                   window.location.href=data.url;            	
	                   $("#create_form").hide(); 
	                   
	                   return false;	                   
	               } else {
	                   $('#nameerrors').text('创建失败！');
	                   //window.location.href=re.url;	                   
	                   return false;
	               }
	        },
	        error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("请求失败，无法获取分组数据");
			}
        });
 		
        return false;
    });
	
})();



function newproject(){
    document.getElementById('createform').style.display = "";
}


function signclose() {
   document.getElementById('createform').style.display = "none";
}    

$('.signclose img').click(function() {
    signclose()
});


//删除左右两端的空格
function trim(str){ 
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

