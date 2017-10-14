/**
 * Created by Administrator on 2017/10/11/011.
 */
//-----------------------------------------------天空对象---------------------------------------------------------
;(function (window){
    function Sky(info){
        this.image = info.image;
        this.x = info.x;
        this.speed = info.speed || 2;
        this.canvas = info.canvas;
        this.context = info.context;
    }
    Sky.prototype = {
        consructor:Sky,
        draw: function (){
            this.x -= this.speed;
            if (this.x<= -this.canvas.width){
                this.x = this.canvas.width;
            }
            this.context.drawImage(this.image,this.x,0,this.canvas.width,this.canvas.height);
        }
    }
    window.Sky = Sky;
}(window));
//-----------------------------------------------陆地对象---------------------------------------------------------
;(function (window){
    function Land(info){
        this.image = info.image;
        this.x = info.x;
        this.speed = info.speed || 2;
        this.canvas = info.canvas;
        this.context = info.context;
    }
    Land.prototype = {
        consructor:Land,
        draw: function (){
            this.x -= this.speed;
            if (this.x<= -this.image.width){
                this.x = this.image.width * 4;
            }
            this.context.drawImage(this.image,this.x,this.canvas.height-this.image.height,this.image.width,this.image.height);
        }
    }
    window.Land = Land;
}(window));
//-----------------------------------------------管道对象---------------------------------------------------------
;(function (window){
    function Pipe(info){
        this.image = info.image;
        this.topImage = info.topImage;
        this.x = info.x;
        this.speed = info.speed || 2;
        this.canvas = info.canvas;
        this.context = info.context;
        this.w = this.image.width;
        //管道的间隔
        this.gap = info.gap || 20;
        //下管道底部，距画布底部的距离
        this.offsetY = info.offsetY;
        //中间管道的间隔
        this.space = 100;
        //上下管道的高度
        this.topHeight = 0;
        this.bottomHeight = 0;
        //初始化管道的高度
        this.initHeight();
    }
    Pipe.prototype = {
        constructor: Pipe,
        draw: function (){
            //1.移动x的位置
            this.x -= this.speed;
            //2.移出舞台排到队伍的后面
            if (this.x<= -this.image.width){
                this.x = this.image.width*5 + this.gap*6;
            }
            //3.绘制上管道
            this.context.drawImage(this.topImage,this.x,0,this.w,this.topHeight);
            //4.绘制下管道
            this.context.drawImage(this.image,this.x,this.topHeight+this.space,this.w,this.bottomHeight);
            //画路径
            this.context.rect(this.x,0,this.w,this.topHeight);
            //console.log(this.w);
            this.context.rect(this.x,this.topHeight+this.space,this.w,this.bottomHeight);

        },
        initHeight: function (){
            //上管道至少是100px，范围是100到250
            this.topHeight = 100 + 150*Math.random();
            //计算下管道的高度
            this.bottomHeight = this.canvas.height-this.topHeight-this.space-this.offsetY;
        }
    }
    window.Pipe = Pipe;
}(window));
//-----------------------------------------------小鸟对象---------------------------------------------------------
;(function (window){
    function Bird(info){
        this.image = info.image;
        this.canvas = info.canvas;
        this.context = info.context;
        this.x = info.x || 100;
        this.y = info.y || 100;

        this.index = 0;
        this.w = info.w;
        this.h = info.h;

        this.v = info.v || 0;
        this.a = info.a || 0.0005;

        this.maxV = 0.5;
        this.maxRadian = 45/180*Math.PI;
        this.startTime = info.startTime || new Date();
    }
    Bird.prototype = {
        constructor:Bird,
        draw: function (){
            this.index++;
            this.xindex = this.index%3;
            var now = new Date();
            var t = now - this.startTime;
            var s = this.v*t + this.a*t*t/2;
            this.y += s;
            //保存当前速度
            this.v = this.v + this.a*t;

            //保存当前时间
            this.startTime = now;
            //保存当前画布状态
            this.context.save();
            //平移坐标系
            this.context.translate(this.x,this.y);
            //当前速度和最大速度的比例
            var percent = this.v/this.maxV;
            //计算当前旋转的弧度
            var radian = this.maxRadian*percent;
            this.context.rotate(radian);
            this.context.drawImage(this.image,this.w*this.xindex,0,this.w,this.h,-this.w/2,-this.h/2,this.w,this.h);
            this.context.restore();
        },
    }
    window.Bird = Bird;
}(window));
//-----------------------------------------------游戏对象---------------------------------------------------------
;(function (window){
    var birdsImg = new Image();
    var landImg = new Image();
    var pipe1Img = new Image();
    var pipe2Img = new Image();
    var skyImg = new Image();

    birdsImg.src = './img/birds.png';
    landImg.src = './img/land.png';
    pipe1Img.src = './img/pipe1.png';
    pipe2Img.src = './img/pipe2.png';
    skyImg.src = './img/sky.png';

    var count = 0;
    var imagesArr = [birdsImg,landImg,pipe1Img,pipe2Img,skyImg];
    imagesArr.forEach(function (img){
        img.onload = function (){
            count++;
            var bird
            if(count == imagesArr.length){
//                console.log(count);
                var rolesArr = [];
                function createRoles(){
//                    创建天空对象
                    for (var i = 0; i < 2; i++){
                        var sky = new Sky({
                            image:skyImg,
                            x:i*skyImg.width,
                            canvas:canvas,
                            context:context
                        });
                        rolesArr.push(sky);
                    };
//                    创建地对象
                    for (var i = 0; i < 5; i++){
                        var land = new Land({
                            image:landImg,
                            x:i*landImg.width,
                            canvas:canvas,
                            context:context
                        });
                        rolesArr.push(land);
                    };
//                    创建管道对象
                    var gap = (canvas.width- 6*pipe2Img.width)/5;
                    for (var i = 0; i < 6; i++){
                        var pipe = new Pipe({
                            topImage:pipe2Img,
                            image:pipe1Img,
                            x:300+(pipe1Img.width+gap)*i,
                            canvas:canvas,
                            context:context,
                            gap:gap,
                            offsetY: landImg.height,
                        });
                        rolesArr.push(pipe);
                    };
//                    创建小鸟对象
                    bird = new Bird({
                        image: birdsImg,
                        w: birdsImg.width / 3,
                        h: birdsImg.height,
                        canvas: canvas,
                        context: context
                    });
                    rolesArr.push(bird);
                }
                createRoles();
                //点击屏幕，让小鸟往上蹦

                canvas.addEventListener("click", function () {
                    bird.v = - 0.2;
                });
                function action(){
                    context.clearRect(0,0,canvas.width,canvas.height);

                    context.beginPath();
                    rolesArr.forEach(function (role){
                        role.draw();
                    });
                    //写文字（时间统计）
                    var now = new Date();
                    var deltaTime = now - startTime;
                    var s = Math.floor(deltaTime / 1000);
                    var h = Math.floor(s / 3600);
                    var m = Math.floor(s / 60);
                    s = s % 60;

                    var text = "您坚持了"+h+1+"小时"+m+"分"+s+"秒";
                    context.textAlign = "right";
                    context.fillStyle = "hotpink";
                    context.textBaseline = "top";
                    context.font = "30px 微软雅黑";
                    context.fillText(text, canvas.width, 0);
//                    小鸟的死亡事件处理
                    if(bird.y>=canvas.height-landImg.height){

                        return;
                    }
                    //小鸟撞柱子上了
                    //在画布上把柱子的路径画出来， 但是不做stroke或者fill的操作
                    if (context.isPointInPath(bird.x, bird.y)) {
                        return;
                    };
                    window.requestAnimationFrame(action);
                }
                //开始计算时间
                var startTime = new Date();
                action();
            }
        }
    });
}(window));