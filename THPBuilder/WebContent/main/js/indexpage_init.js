;
(function() {

    'use strict';

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    var mobileMenuOutsideClick = function() {

        $(document).click(function(e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas')) {

                    $('body').removeClass('offcanvas');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }


            }
        });

    };


    var offcanvasMenu = function() {

        $('#page').prepend('<div id="fh5co-offcanvas" />');
        $('#page').prepend('<a href="javascript:void(0)" class="js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white"><i></i></a>');
        var clone1 = $('.menu-1 > ul').clone();
        $('#fh5co-offcanvas').append(clone1);
        var clone2 = $('.menu-2 > ul').clone();
        $('#fh5co-offcanvas').append(clone2);

        $('#fh5co-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
        $('#fh5co-offcanvas')
            .find('li')
            .removeClass('has-dropdown');

        // Hover dropdown menu on mobile
        $('.offcanvas-has-dropdown').click(function() {
                var $this = $(this);
                if (!$this.hasClass('active')) {
                    $this
                        .addClass('active')
                        .find('ul')
                        .slideDown(500, 'easeOutExpo');
                } else {
                    $this
                        .removeClass('active')
                        .find('ul')
                        .slideUp(500, 'easeOutExpo');
                }

            })
            
        //     .mouseleave(function() {

        //     var $this = $(this);
        //     $this
        //         .removeClass('active')
        //         .find('ul')
        //         .slideUp(500, 'easeOutExpo');
        // });


        $(window).resize(function() {

            if ($('body').hasClass('offcanvas')) {

                $('body').removeClass('offcanvas');
                $('.js-fh5co-nav-toggle').removeClass('active');

            }
        });
    };


    var burgerMenu = function() {

        $('body').on('click', '.js-fh5co-nav-toggle', function(event) {
            var $this = $(this);


            if ($('body').hasClass('overflow offcanvas')) {
                $('body').removeClass('overflow offcanvas');
            } else {
                $('body').addClass('overflow offcanvas');
            }
            $this.toggleClass('active');
            event.preventDefault();

        });
    };

    var fullHeight = function() {

        if (!isMobile.any()) {
            $('.js-fullheight').css('height', $(window).height());
            $(window).resize(function() {
                $('.js-fullheight').css('height', $(window).height());
            });
        }

    };



    var contentWayPoint = function() {
        var i = 0;
        $('.animate-box').waypoint(function(direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function() {

                    $('body .animate-box.item-animate').each(function(k) {
                        var el = $(this);
                        setTimeout(function() {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn animated-fast');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated-fast');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated-fast');
                            } else {
                                el.addClass('fadeInUp animated-fast');
                            }

                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, { offset: '85%' });
    };


    var dropdown = function() {

        /*$('.has-dropdown').mouseenter(function() {

            var $this = $(this);
            $this
                .find('.dropdown')
                .css('display', 'block')
                .addClass('animated-fast fadeInUpMenu');

        }).mouseleave(function() {
            var $this = $(this);

            $this
                .find('.dropdown')
                .css('display', 'none')
                .removeClass('animated-fast fadeInUpMenu');
        });*/
        //$('.has-dropdown').dropdown();
        $('.has-dropdown').click(function() {

            var $this = $(this);
            $this
                .find('.dropdown')
                .css('display', 'block')
                .addClass('animated-fast fadeInUpMenu');

        });
        document.addEventListener('click', function(e){
            var parent=$(e.target).parents('.has-dropdown');
            if(parent.length == 0&&!$(e.target).hasClass('has-dropdown')){
                $('.has-dropdown').find('.dropdown').css('display', 'none').removeClass('animated-fast fadeInUpMenu');
            }
        });
    };


    var goToTop = function() {

        $('#gotopheade').on('click', function(event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500, 'easeInOutExpo');

            return false;
        });
        
        // $('.js-shape').on('click', function(event) {

        //     console.log('asdfasdf')

        //     return false;
        // });
        
        /*
           $('.js-like').on('click', function(event) {

            console.log('documentlike')
            $.get("/documentlike", {
                key: off_key,
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken "]').val()
            }, function(re) {
                $('.likes-count').text('阅读 ' + re.like);
            }, 'json');
            return false;
        });
        
        */
        
        var likelock = false;
        $('#like_action').click(function(){
            if(getCookie('loginStatus')){
                if(!likelock){
                    likelock = true;
                    $.get('/share/like/?doc_no='+off_key,function(data){
                        var like_num=$('.likes-count').text();
                        like_num=like_num.split(' ');
                        like_num=parseInt(like_num[1]);

                        //console.log(data);
                        if(data.status == 1){
                            $('#like_action').find('i.icon-thumbs-up').css('color','#f68080');
                            like_num++;
                            $('.likes-count').text('赞 '+like_num);
                        }else{
                            $('#like_action').find('i.icon-thumbs-up').css('color','');
                            like_num--;
                            $('.likes-count').text('赞 '+like_num);
                        }
                        likelock = false;
                    });
                }else{
                    console.log('locking...');
                }
            }else{
                start();
            }
        });
        var favorlock = false;
        $('#favor_action').click(function(){
            if(!getCookie('loginStatus')){
                start();
                return ;
            }
            if(!favorlock){
                favorlock = true;
                var hearticon = $('#favor_action').find('i');
                var isfavor = hearticon.attr('isfavor');
                if(isfavor == 'true'){
                    $.get('/share/removefavor/?doc_no='+off_key,function(data){
                        var hearticon = $('#favor_action').find('i.icon-heart3');
                        hearticon.removeClass('icon-heart3').addClass('icon-heart2');
                        hearticon.css('color','');
                        hearticon.attr('isfavor',false);
                        favorlock = false;
                  });
                }else {
                    $.get('/share/addfavor/?doc_no='+off_key,function(data){
                        var hearticon = $('#favor_action').find('i.icon-heart2');
                        hearticon.removeClass('icon-heart2').addClass('icon-heart3');
                        hearticon.css('color','#f68080');
                        hearticon.attr('isfavor',true);
                        favorlock = false;
                    });
                }
            }else{
                console.log('locking...');
            }
        });
        
        
        $(window).scroll(function() {

            var $win = $(window);
            if ($win.scrollTop() > 200) {
                $('.js-top').addClass('active');
            } else {
                $('.js-top').removeClass('active');
            }

        });

    };


    // Loading page
    var loaderPage = function() {
        $(".fh5co-loader").fadeOut("slow");
    };


    var counterWayPoint = function() {
        if ($('#fh5co-counter').length > 0) {
            $('#fh5co-counter').waypoint(function(direction) {

                if (direction === 'down' && !$(this.element).hasClass('animated')) {
                    setTimeout(counter, 400);
                    $(this.element).addClass('animated');
                }
            }, { offset: '90%' });
        }
    };

    var sliderMain = function() {

        $('#fh5co-hero .flexslider').flexslider({
            animation: "fade",
            slideshowSpeed: 5000,
            directionNav: true,
            start: function() {
                setTimeout(function() {
                    $('.slider-text').removeClass('animated fadeInUp');
                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                }, 500);
            },
            before: function() {
                setTimeout(function() {
                    $('.slider-text').removeClass('animated fadeInUp');
                    $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
                }, 500);
            }

        });

        $('#fh5co-hero .flexslider .slides > li').css('height', $(window).height());
        $(window).resize(function() {
            $('#fh5co-hero .flexslider .slides > li').css('height', $(window).height());
        });

    };

    function clearError(){
        $("#signform input").focus(function(){
            $('#emailerrors').text('');
            $('#forgetanemailerrors').text('');
            $('#resetemailerrors').text('');
            $('#regerrors').text('');
        });
    }


    $(function() {

        mobileMenuOutsideClick();
        offcanvasMenu();
        burgerMenu();
        contentWayPoint();
        sliderMain();
        dropdown();
        goToTop();
        loaderPage();
        counterWayPoint();
        fullHeight();
        toastr.options = {
            "closeButton": false,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            /*        "positionClass": "toast-bottom-center",*/
            "positionClass": "toast-top-center",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }

    });



    var option = {
        success: function(re) {
            if (re.success) {
                // window.open(re.url)
                if(off_key==""){
                    window.location.href=re.url
                    return false;

                }else if(off_key=="toeditor"){
                    window.location.href='editor.html';
                    return false;
                }                
                
                window.location.href=""
                // var href = window.location.href;
                // window.location.href = href;
                // window.location.reload();
                // window.location.reload();
                //     $("#to_login_div ").hide();
                //     $("#to_reg_div ").hide();
                //     $("#user_menu ").show();

                //     $("#username_span ").text(re.username);
                //     setCookie('loginStatus', 1);
                //     //$("#head_portrait_a ").attr("src ", result.head_portrait);
                //     var update_href = function(a) {
                //         var href = a.attr("href ");
                //         href = href + result.id + "/ ";
                //         a.attr("href ", href);
                //     };
                //     signclose();
            } else {
                $('#emailerrors').text('账号密码错误');
                return false;
            }


        },
        error: function(re) {
            alert(re.msg);
            return false;
        },
        dataType: 'json'
    }
    
    $('#loginBtn').click(function() {
        $('#login_form').ajaxSubmit(option);
        return false;
    })
    
    delCookie('loginStatus');
    
    $.get(
		"/THPBuilder/login_status", 
		{}, 
		function(result) {
	        if (result.is_login) {	        	
	            $("#to_login_div ").hide();
	            $("#to_reg_div ").hide();
	            $("#user_menu ").show();
	            $(".mydocuments_menu").show();
	            //setCookie('loginStatus', 1);
	            $("#username_span ").text(result.username);
	            textToImg(result.username, $("img[name='head_portrait_a']"))
	                // document.getElementById("head_portrait_a").src = result.head_portrait;
	                // $("img[name='head_portrait_a']").attr("src", result.head_portrait);
	                //$("#head_portrait_a ").attr("src ", result.head_portrait);
	            
	            var update_href = function(a) {
	                var href = a.attr("href ");
	                href = href + result.id + "/ ";
	                a.attr("href ", href);
	            };
	            
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
	        } else {
	        	
	            $("#to_login_div ").show();
	            $("#to_reg_div ").show();
	            $("#user_menu ").hide();
	            $(".mydocuments_menu").hide();
	
	            /*
	            daovoice('init', {
	              app_id: "abcfe652"
	            });
	            daovoice('update');
	            */
	        }
	
	        var left = ($("#user_menu ").width() - 170);
	        var ml = -15 - ($("#user_menu ").width() - 170);
	        $("#user_menu ").css("margin-left ", ml + "px ");
	        $("#user_menu ").css("position ", "relative ");
	        $("#user_menu ").css("left ", left + "px ");
	    }, 
	    'json');
    
    // $('.views-count').text('阅读 ' + 'ertwert');


    //$(function() {
    $("a[name='changereg']").click(function() {
        // $('.signformword').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
        $('#regerrors').text();
        $('#emailerrors').text('');
        $('.loginanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
        $('.reqanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');

        // $('.forget').css("display", "none");
    });   
    
    //})
    
    $("a[name='forgetpwd']").click(function() {
        $('#emailerrors').text('');
        $('#forgetanemailerrors').text();
        $('.loginanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
        $('.forgetanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
    });
    $('#pwstreg').click(function() {
        $('#regerrors').text();
        $('#forgetanemailerrors').text();
        $('.forgetanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
        $('.reqanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
    });


    // $('#to_login_div a').click(
    //     function() {
    //         document.getElementById('signform').style.display = ""
    //     });

     function signclose() {
        document.getElementById('signform').style.display = "none"
        document.getElementById('signformpwd').style.display = "none"
        document.getElementById('registerform').style.display = "none"
        document.getElementById('resetpwd').style.display = "none"
    }    
    
    $('.signclose img').click(function() {
         signclose()
    });

    function loading() {
        document.getElementById('registerloading').style.display = ""
    }

    //注册
    function check_send(id, code_text) {
        var $btn = $("#" + id);
        var v = $btn.attr("data-remain");
        if (!v) {
            v = 60;
            $btn.attr("data-remain", v);
        }

        v = parseInt(v);
        if (v <= 0) {
            $btn.text(code_text);
            $btn.removeAttr("disabled")
            $btn.removeAttr("data-remain");
            $btn.css("color", "white");
        } else {
            v -= 1;
            $btn.css("color", "black");
            $btn.text("请等待" + v + "秒");
            $btn.attr("disabled", 'true');
            $btn.attr("data-remain", v);
            window.setTimeout(check_send, 1000, id, code_text);
        }
    }
    $('#send_reg_code').click(function() {
        var email = $("#email-input").val();
        var username = $("#registeruser").val();
        if ($.trim(email) == "") {
            $("#email-input").next().text("请首先输入邮箱");
            return false;
        }
        if (!isEmail(email)) {
            $("#email-input").next().text("请正确填写邮箱");
            return false;
        }


        $.post("/reg/send_code/", { email: email,username: username}, function(re) {
            if (!re.success) {
                $("#registeruser").next().text(re.usernameError||'');
                 $("#email-input").next().text(re.emailError||'');
                 if(re.usernameError){
                    $("#registeruser").parent().css('margin-bottom','0px')
                 }else{
                    $("#registeruser").parent().css('margin-bottom','20px')
                 }
                 if(re.emailError){
                    $("#email-input").parent().css('margin-bottom','0px')
                 }else{
                    $("#email-input").parent().css('margin-bottom','20px')
                 }

                // $('#regerrors').text(re.errors);
                // alert("发送失败: " + re.reason);
                return;
            }else{
                $("#registeruser").next().text('');
                $("#email-input").next().text('');
                $("#registeruser").parent().css('margin-bottom','20px')
                $("#email-input").parent().css('margin-bottom','20px')
                check_send('send_reg_code', '发送注册码');
            }
        }, 'json')
    });

    var reqoption = {
        success: function(re) {
            if (re.success) {
                toastr['success']("注册成功！")
                $('.reqanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                $('.loginanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                $("#registeruser").parent().css('margin-bottom','20px')
                $("#email-input").parent().css('margin-bottom','20px')
                $("#registerrepwd").parent().css('margin-bottom','20px')
                $("#registerpwd").parent().css('margin-bottom','20px')
                $("#send_reg_code").parent().css('margin-bottom','20px')
            } else {
                $("#registeruser").next().text(re.usernameError||'');
                $("#email-input").next().text(re.emailError||'');
                if(re.usernameError){
                    $("#registeruser").parent().css('margin-bottom','0px')
                }else{
                    $("#registeruser").parent().css('margin-bottom','20px')
                }
                if(re.emailError){
                    $("#email-input").parent().css('margin-bottom','0px')
                }else{
                    $("#email-input").parent().css('margin-bottom','20px')
                }
                if(re.passwordErrors){
                    $("#registerpwd").next().text(re.passwordErrors);
                    $("#registerpwd").parent().css('margin-bottom','0px')
                }else{
                    $("#registerpwd").parent().css('margin-bottom','20px')
                }
                if(re.password_repeatErrors){
                    $("#registerrepwd").next().text(re.password_repeatErrors);
                    $("#registerrepwd").parent().css('margin-bottom','0px')
                }else{
                    $("#registerrepwd").parent().css('margin-bottom','20px')
                }
                if(re.reg_codeErrors){
                    $("#send_reg_code").next().text(re.reg_codeErrors);
                    $("#send_reg_code").parent().css('margin-bottom','0px')
                }else{
                    $("#send_reg_code").parent().css('margin-bottom','20px')
                }
            }

            return false;
        },
        error: function(re) {
            console.log(re)
            return false;
        },
        dataType: 'json'
    }
    
    
    $('#reqbtn').click(function() {
        var email = $("#email-input").val();
        var isError=true;
        if ($.trim(email) == "") {
            isError=false;
            $("#email-input").next().text("请首先输入邮箱");
            $("#email-input").parent().css('margin-bottom','0px')
            // return false;
        }
        if (!isEmail(email)) {
            isError=false;
            $("#email-input").next().text("请正确填写邮箱");
            $("#email-input").parent().css('margin-bottom','0px')
            // return false;
        }
        if(!isError){
            return false;
        }else{
            $("#email-input").parent().css('margin-bottom','20px')
            $("#registerrepwd").parent().css('margin-bottom','20px')
        }
        $('#req_form').ajaxSubmit(reqoption);
        return false;
    })


    function isEmail(str) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(str);
    }


    //验证
    $("#send_reset_code").click(function() {

        var email = $("#forgetemail").val();
        if ($.trim(email) == "") {
            alert("请首先输入邮箱");
            return;
        }


        $.post("/modify/send_code/", { email: email }, function(re) {
            if (!re.success) {
                $('#forgetanemailerrors').text(re.errors);
                //alert("发送失败: " + re.reason);
                return false;
            } else {
                $('.forgetanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                $('.resetanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                check_send('re_reset_code', '重新发送');
                $("#restuser").val(email)
                    // $("#restuser").attr("disabled", "disabled");

            }
        }, 'json')
        return false;
    })
    
    $("#re_reset_code").click(function() {
        var email = $("#restuser").val();
        $.post("/modify/send_code/", { email: email }, function(re) {
            if (!re.success) {

                $('#resetemailerrors').text(re.errors);
                // alert("发送失败: " + re.reason);
                return false;
            } else {
                check_send('re_reset_code', '重新发送');

            }
        }, 'json');
    })
    
    
    $("#resetpwdbtn").click(function() {
        $('#reset_form').ajaxSubmit({
            success: function(re) {
                if (re.success) {
                    $('.resetanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');
                    $('.loginanimate').animate({ height: 'toggle', opacity: 'toggle' }, 'slow');

                } else {
                    $('#resetemailerrors').text(re.errors);
                }
                return false;
            },
            error: function(re) {
                console.log(re)
                    //alert('出错，请重试！');
                return false;
            },
            dataType: 'json'
        });
        return false;
    })
}());

function my_quit() {
    $.get("/remote_logout/", {}, function(result) {
        $("#to_login_div ").show();
        $("#to_reg_div ").show();
        $("#user_menu ").hide();
        delCookie('loginStatus');
    })
}

function start() {
    document.getElementById('signform').style.display = ""
}

function setCookie(name, value) {   
    var Days = 30;   
    var exp = new Date();   
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);   
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name) {   
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");    
    if (arr = document.cookie.match(reg))        return unescape(arr[2]);   
    else       return null;
}

//删除cookies
function delCookie(name) {   
    var exp = new Date();   
    exp.setTime(exp.getTime() - 1);   
    var cval = getCookie(name);   
    if (cval != null)       document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}


/**
 * 字母图片
 * @param {*} 要转换的名称取第一个
 * @param {*} 要放置的图片的jq取值
 */
function textToImg(uname, jq) {
    //             var uname = 'Joy';
    var name = uname.charAt(0).toUpperCase();
    var fontSize = 60;
    var fontWeight = 'bold';

    var canvas = document.createElement('canvas');
    //             var img1 = document.getElementById('headImg');
    canvas.width = 120;
    canvas.height = 120;
    var context = canvas.getContext('2d');
    context.fillStyle = '#d0e5f8';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#605CA8';
    context.font = fontWeight + ' ' + fontSize + 'px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = "middle";
    context.fillText(name, fontSize, fontSize);
    //             $("img[name='head_portrait_a']").attr('src',canvas.toDataURL("image/png"));
    jq.attr('src', canvas.toDataURL("image/png"));
};

// function saveForm() {
//     // var option = {
//     //         success: function(re) {
//     //             console.log('asdf');
//     //             return false;
//     //         },
//     //         error: function() {
//     //             alert(re.msg);
//     //             return false;
//     //         },
//     //         dataType: 'json'
//     //     }
//     $('#reset_password_form').ajaxSubmit(function() {
//         console.log(1)
//     });
//     return false;
// }

