/**
 * Created by Administrator on 2017/9/29/029.
 */
//-----------------------------------食物对象部分----------------------------------------------------------------------------
;(function (window){
    var list = [];
    function Food(x,y,width,height,color){
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 20;
        this.height = height || 20;
        this.color = color || 'yellowgreen';
        //console.log(this);
    }
    Food.prototype.render = function (map){

        this.x = Math.floor(Math.random()*map.offsetWidth/this.width)*this.width;
        this.y = Math.floor(Math.random()*map.offsetHeight/this.height)*this.height;
        //创建map子元素
        remove();
        var div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = this.x+"px";
        div.style.top = this.y +"px";
        div.style.width = this.width +"px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
        map.appendChild(div);
        list.push(div);
    }
    function remove(){
        for (var i = list.length - 1; i >= 0; i--) {
            list[i].remove();
            //list[i].parentNode.removeChild(list[i]);
            //list.pop();
        }
    }
    window.Food = Food;
}(window));
//-----------------------------------蛇对象部分----------------------------------------------------------------------------
;(function (window){
    function Snake(width,height,direction){

        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || 'right';
        //蛇一开始由三节组成的
        this.body = [
            {x:3,y:1,color:'red'},
            {x:2,y:1,color:'pink'},
            {x:1,y:1,color:'yellowgreen'}
        ];
    }
    //声明一个数组来保存div
    var list = [];

    //蛇在地图上显示出来
    Snake.prototype.render = function (map){
        //显示蛇新位置前把蛇j旧位置删除
        remove();
        for (var i = 0; i < this.body.length; i++){

            var unit = this.body[i];
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = unit.x*this.width + 'px';
            div.style.top = unit.y*this.height + 'px';
            div.style.width = this.width + 'px';
            div.style.height = this.height +'px';
            div.style.backgroundColor = unit.color;
            map.appendChild(div);
            list.push(div);
        };
    }
    //让蛇动起来
    Snake.prototype.move = function (food,map){
        //蛇移动,每一个蛇身体都要动
        var i = this.body.length - 1;//这个i就是蛇身体最后一个的下标
        for (; i > 0; i--){
            this.body[i].x =this.body[i-1].x;
            this.body[i].y =this.body[i-1].y;
        };
        //蛇头移动的方向
        switch (this.direction){
            case 'left':
                this.body[0].x--;
                break;
            case 'top':
                this.body[0].y--;
                break;
            case 'right':
                this.body[0].x++;
                break;
            case 'bottom':
                this.body[0].y++;
                break;
        }

        //声明一个数组来存随机颜色字符串
        var arrColor = [1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];

        var colorRand = '#';
        for (var i = 0; i < 6; i++){
            var rand = Math.floor(Math.random()*15);
            //console.log(rand);
            colorRand += arrColor[rand];
        };
        //console.log(colorRand);
        //判断蛇是否吃的食物，吃到增加一节，也就是判断蛇头坐标与食物坐标是否重合
        var foodX = food.x;
        var foodY = food.y;
        var headX = this.body[0].x * this.width;
        var headY = this.body[0].y * this.height;
        if (foodX==headX && foodY==headY){
            var obj = this.body[this.body.length-1];
            this.body.push({
                x:obj.x,
                y:obj.y,
                color:colorRand
            });
            console.log(this);
            food.render(map);
        }
    }

    //5.删除蛇的方法-私有方法
    function remove() {
        //遍历出蛇的每一节把他给移除掉。

        for (var i = list.length - 1; i >= 0; i--) {
            list[i].remove();
            //list[i].parentNode.removeChild(list[i]);
            //list.pop();
        }
    }
    window.Snake = Snake;
}(window));
//-----------------------------------游戏对象部分----------------------------------------------------------------------------
;(function (window){
    //先声明一个变量
    var that = null;
    //1.构造函数
    function Game(map){
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
        that = this;
    }
    //游戏开始的方法
    Game.prototype.start = function (){
        this.food.render(this.map);
        this.snake.render(this.map);
        //蛇在移动
        this.snake.move(this.food,this.map);
        //新的位置在地图上显示
        this.snake.render(this.map);
        //让蛇自动走
        runSnake();
        //让蛇根据键盘按键来移动
        bindKey();
    }
    //让蛇根据键盘按键来移动
    function bindKey(){
        document.addEventListener('keydown',function (e){
            e = e || window.event;
            //console.log(e.keyCode);
            switch (e.keyCode){
                case 37:
                    this.snake.direction = 'left';
                    break;
                case 38:
                    this.snake.direction ='top';
                    break;
                case 39:
                    this.snake.direction ='right';
                    break;
                case 40:
                    this.snake.direction ='bottom';
                    break;
            }
        }.bind(that),false);
    }
    //蛇自动移动起来 - 私有方法
    function runSnake(){
        //设置一个计时器
        var timeId = setInterval(function (){
            //console.log(this);
            this.snake.move(this.food,this.map);
            this.snake.render(this.map);
            //判断蛇是否撞墙，就是判断蛇头的位置
            var headX = this.snake.body[0].x*this.snake.width;
            var headY = this.snake.body[0].y*this.snake.height;
            if (headX>=this.map.offsetWidth || headY >= this.map.offsetHeight || headX < 0  || headY < 0){
                alert('游戏结束');
                clearInterval(timeId);
            }
        }.bind(that),200);
    }
    window.Game = Game;
}(window));