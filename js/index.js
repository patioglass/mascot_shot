$(function(){
	var game_flag=false;
	var ranking_flag=false;
	$(".gamestart").click(function(){
		if(!game_flag){
			$(this).text("ゲーム画面を閉じる");
			$("#enchant-stage").fadeIn("slow");
			$("body,html").animate({scrollTop:$("#enchant-stage").offset().top-30},500);
			game_flag=true;
		}else{
			$(this).text("ゲームを始める");
			$("#enchant-stage").fadeOut("slow");
			game_flag=false;
		}
	});
	$(".scroll-rule").click(function(){
		$("body,html").animate({scrollTop:$(".rule").offset().top},500);
	});

	$(window).scroll(function(){
		if($(this).scrollTop()>$(".rule").offset().top ){
			$(".pagetop").fadeIn();
		}else{
			$(".pagetop").fadeOut();
		}
	});
	$(".pagetop").click(function(){
		$("body,html").animate({scrollTop:0},500);
		return false;
	});	

	$(".charactor_left img").hover(function(){
		$(this).addClass("animated");
		$(this).addClass("rubberBand");
	},function(){
		$(this).removeClass("animated");
		$(this).removeClass("rubberBand");
	});



});