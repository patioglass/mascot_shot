enchant();
var score=0;//スコア表示
var spped_level=1;//落下スピードの管理
var add_bullet_flag=true;//弾連射防ぐフラグ
var append_charactor = [];
var hp=0;
var all_delete_flag=false;
var charactor_name = ["美雲このは","美雲あんず","暮井 慧","クラウディア・窓辺","大鳥こはく","クエリ・ラヴクラフト"];
window.onload=function(){

	var core = new Core(1100,720);

	//画像の読み込み
	core.preload("img/player1.png");
	core.preload("img/player_move1.png");
	core.preload("img/bullet1.png");
	core.preload("img/charactor1.png");
	core.preload("img/all_title.jpg");
	core.preload("img/back_charactor1.png")

	core.fps=30;
	core.onload = function(){
		
		core.keybind(32,"space");

	var createTitleScene = function(){
		var scene = new Scene();
		var pict = new Sprite(576,357);
		pict.x = 250;
		pict.y = 200;
		pict.image = core.assets["img/all_title.jpg"];
		scene.addChild(pict);

		scene.on("touchstart",function(){
			scene.removeChild(pict);
			core.replaceScene(createGameScene());
		});
		return scene;
	};

	var createPoseScene = function(){
		var scene = new Scene();
		scene.bakcgroundColor = 'rgba(255,255,255,0.5)';
		var back = new Entity();
		back._element = document.createElement("div");
		back._element.innerHTML = '<div class="pose">クリックで解除</div>'
		scene.addChild(back);
		scene.on("touchstart",function(){
			core.popScene();
		});
		return scene;
	}

	var createGameOverScene = function(back_charactors){
		var scene = new Scene();
		scene.bakcgroundColor = "#ffffff";
		
		var result = new Entity();
		result._element = document.createElement("div");
		result.width=320;
		result._element.innerHTML='<div class="result">'+score+'点獲得！</div>';
		
		var restart = new Entity();
		restart._element = document.createElement("a");
		restart._element.innerHTML='<div class="restart">もう一度プレイする</div>';
        scene.addChild(result);
		scene.addChild(restart);

		var ranking_all = new Entity();
		ranking_all._element = document.createElement("a");
		ranking_all._element.innerHTML='<div class="ranking_all"><a href="https://twitter.com/search?f=realtime&q=%23%E3%83%9E%E3%82%B9%E3%82%B3%E3%83%83%E3%83%88%E3%82%92%E6%92%83%E3%81%A1%E8%90%BD%E3%81%9B%EF%BC%81" target="_blank">みんなの記録を見る</a></div>';
        scene.addChild(ranking_all);

   		var nums = [];
   		var rank = [];
   		var temp=0;
   		var box=0;

   		for(var i=0;i<6;i++){
   			rank[i] = back_charactors[i].shot_num;
   			nums[i] = new Entity();
			nums[i]._element = document.createElement("div");
			back_charactors[i].frame=back_charactors[i].frame-6;
			if(box<back_charactors[i].shot_num){
				box = back_charactors[i].shot_num;
   				temp = back_charactors[i].frame;
   			}
			back_charactors[i].y=0;
			nums[i].x=back_charactors[i].frame*200;
			nums[i].y=0;
			nums[i]._element.innerHTML='<div class="char_num">×'+back_charactors[i].shot_num+'</div>';
			back_charactors[i].image=core.assets["img/charactor1.png"]; 
   			scene.addChild(nums[i]);
   			scene.addChild(back_charactors[i]);
   		}

   		rank = rank.sort(function(a,b){return b-a});

		var tweet = new Entity();
		tweet._element = document.createElement("a");
		tweet._element.innerHTML='<div class="tweet_result"><a href="http://twitter.com/intent/tweet?url=http://mascotshot.web.fc2.com/&text='+score+'点獲得しました！1番多く落としたのは「'+charactor_name[temp]+'」で'+rank[0]+'回でしたっ&hashtags=マスコットアプリ文化祭%2Cマスコットを撃ち落せ">結果をツイートする</div>';
   		scene.addChild(tweet);

		restart.on("touchstart",function(){
			score=0;//スコア表示
	 		spped_level=1;//落下スピードの管理
			add_bullet_flag=true;//弾連射防ぐフラグ
			append_charactor = [];
			hp=0;
			all_delete_flag=false;
			core.replaceScene(createTitleScene());
		});
		return scene;
	}


	var createGameScene = function(){
/*******クラスの定義*******/
		var scene = new Scene();
		//下に配置するキャラのクラス
		var BackgroundCharactor = Class.create(Sprite,{
			initialize:function(type){
				Sprite.call(this,204,204);
				this.x=type*180;
				this.y=550;
				this.shot_num=0;
				this.hit_flag=false;
				this.frame=type;
				this.image=core.assets["img/back_charactor1.png"]; 

				var num = new Entity();
				num._element = document.createElement("div");
				num.x=type*180;
				num.y=550;

				this.on("enterframe",function(){
					num._element.innerHTML='<div class="char_num">×'+this.shot_num+'</div>';
				});

				scene.addChild(num);
				scene.addChild(this);
			},
			//打ちそこなったキャラの画像を差し替え
			hit:function(){
				if(this.frame==13){
					return;
				}
				if(!this.hit_flag){
					this.hit_flag=true;
					hp++;
					append_charactor[this.frame]=false;
					this.frame=this.frame+6;
				}
			},
			add_num:function(type){
				if(append_charactor[this.frame]){
					this.shot_num++;
				}
			}
		});


		//落ちてくるキャラクターのクラス
		var Charactor = Class.create(Sprite,{
			initialize:function(x,s,type){
				Sprite.call(this,204,204);
				this.x=x;
				this.y=-100;
				this.frame=type;
				this.hit_f=false;
				this.breaktime=10;
				this.image=core.assets["img/charactor1.png"];

				this.on("enterframe",function(){
					this.y+=s;
					if(this.frame==13){
						this.sceneBefore();
					}
					//定期的に落ちるキャラを生成
					if(this.age % 450 == 0){
						this.addCharactor();
					}

					//弾とぶつかったときの処理
					if(this.within(bullet,80) && this.y<590 && !this.hit_f && !all_delete_flag){
						this.addCharactor();
						point(this.x,this.y,bullet.addCombo());
						this.hit();

					}

					//下までキャラが落ちた時の処理
					if(this.y>700 && this.frame <6 && !all_delete_flag){
						back_charactors[this.frame].hit();
						this.addCharactor();
						scene.removeChild(this);
					}

					//全削除
					if(all_delete_flag && this.frame!=13 && this.breaktime==10){
						point(this.x,this.y,100);
						this.hit();
					}

					if(this.hit_f){
						this.breaktime--;
					}


					if(this.hit_f && this.breaktime<0){
						if(this.frame==13){
							this.d_after_add();
						}
						all_delete_flag=false;
						scene.removeChild(this);
					}

				});
				scene.addChild(this);
			},
			//新しくCharactorクラスを生成するメソッド
			addCharactor:function(){
				var charactor = new Charactor(rand(1000),rand(spped_level),rand_s(100000));
			},

			//弾に当たった時に画像を変える
			hit:function(){
				if(!this.hit_f){
					if(this.frame==13){
						all_delete_flag=true;
						this.hit_f=true;
						return;
					}else{
						back_charactors[this.frame].add_num(this.frame);
					}
					this.frame=this.frame+6;
					this.hit_f=true;
				}
			},
			d_after_add:function(){
				for(var i=0;i<6;i++){
					this.addCharactor();
				}
			},
			sceneBefore:function(){
				scene.removeChild(this);
				scene.addChild(this);
			}
		});


		//プレイヤーが操作するオブジェクトのクラス
		var Player = Class.create(Sprite,{
			initialize:function(){
				Sprite.call(this,204,204);
				this.x=455;
				this.y=400;
				this.image=core.assets["img/player_move1.png"];


				this.on("enterframe",function(){
					if(core.input.left){
						if(this.rotation>-85){
							this.rotation-=5;
						}
					}
					if(core.input.right){
						if(this.rotation<80){
							this.rotation+=5;
						}	
					}
				});

				scene.addChild(this);
			}
		});


		//プレイヤーの画像描写のみの部分
		var Player_move = Class.create(Sprite,{
			initialize:function(){
				Sprite.call(this,204,204);
				this.x=460;
				this.y=350;
				this.image=core.assets["img/player1.png"];

				scene.addChild(this);
			}
		});


		var PoseButton = Class.create({
			initialize:function(){
				var pose = new Entity();
				pose.x=0;
				pose.y=50;
				pose._element = document.createElement("div");
				scene.addChild(pose);
				pose._element.innerHTML = '<div class="pose_button">ポーズ</div>'

				pose.on("touchstart",function(){
					core.pushScene(createPoseScene());
				});

			}
		});



		//弾クラス
		var Bullet = Class.create(Sprite,{
			initialize:function(rotation){
				Sprite.call(this,51,51);
				this.x=535;
				this.y=500;
				this.radian=rotation;
				this.combo=0;
				this.point=0;
				add_bullet_flag=false;
				this.image=core.assets["img/bullet1.png"];

				this.on("enterframe",function(){
						this.x+=this.radian*0.35;
						this.y-=30-Math.abs(this.radian*0.3);

						//枠外に弾が行けばremove
						if(this.y<-100 || this.x>1380 || this.x<-100){
							add_bullet_flag=true;
							scene.removeChild(this);
						}
					
				});
				scene.addChild(this);
			},
			//同じ球が連続して当たれば得点追加
			addCombo:function(){	
				if(this.point==0){
					this.point=10;
				}else if(this.point<160){
					this.point*=2;
				}else{
					this.point=256;
				}
				return this.point;
			}

		});


		//スコア表示クラス
		var Score = enchant.Class.create({
			initialize:function(){
				var result_score = new Entity();
				result_score.x=400;
				result_score.y=50;
				result_score._element = document.createElement("div");
				scene.addChild(result_score);

				result_score.on("enterframe",function(){
					result_score._element.innerHTML='<div class="result_score">'+score+'</div>';
				});

			}
		});

		scene.on("enterframe",function(){

			//定期的に落下キャラを追加
			if((scene.age/core.fps)%10==0){
				var charactor = new Charactor(rand(1000),rand(spped_level),rand_s(100000));
			}

			//一定時間で速度の増加
			if((scene.age/core.fps)%60==0){
				spped_level+=1;
			}
			if((scene.age/core.fps)%80==0){
				chance = new Charactor(rand(1000),1,13);
			}
			if(hp==6){
				core.replaceScene(createGameOverScene(back_charactors));
			}
			//スペースを押すと弾クラスを生成
			if(core.input.space){
				if(add_bullet_flag){
					bullet = new Bullet(player.rotation);
				}
			}
		});


		//ポイントが加算された時に呼ぶ関数	
		function point(x,y,n){
			
			var result = new Entity();
			result.x=x+100;
			result.y=y+50;
			result._element = document.createElement("div");

			score+=n;
			switch(n){
				case 10:
				case 20:
					result._element.innerHTML='<div class="point_10">'+n+'</div>';
				break;
				case 40:
				case 80:
					result._element.innerHTML='<div class="point_40">'+n+'</div>';
				default:
					result._element.innerHTML='<div class="point_max">'+n+'</div>';
				break;

			}
			scene.addChild(result);
			result.on("enterframe",function(){
				if(this.age%10==0){
					scene.removeChild(this);
				}
			});
		}
/*****************************************************************/
		var pose_button = new PoseButton(); 
		var charactor = new Charactor(rand(1000),rand(1),rand_s(100000));
		var player = Player();
		var player_move = Player_move();
		var back_charactors = [];
		var bullet = 0;
		for(var i=0;i<6;i++){
			back_charactors[i] = new BackgroundCharactor(i);
			append_charactor[i]=true;
		}
		var score_label = new Score();
		return scene;
		
	};
		


	core.replaceScene(createTitleScene());
	}
	core.start();
};


//スピード計算用のランダムの小数値を返す関数
function rand(n){
	return Math.random()*(n+1)+0.1;
}

//画像の種類を返す関数
function rand_s(n){
	var num=Math.floor((Math.random()*n)%6);
	for(var i=0;i<5;i++){
		if(append_charactor[num]){
			return num;
		}
		num++;
		if(num==7){
			num=0;
		}
	}
	return Math.floor((Math.random()*n)%6);
}
