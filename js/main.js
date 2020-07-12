'use strict';

// global variables
let brc = [];
let boundary;
let score;
let active_brc_index;
let timerflag = false;
let timerlaunch = false;

// preload branches BEFORE setup()
function preload() {
  getBranches(plate_12); // check this function in LibraryBranch.js. You can also try plate_20
}

function setup() {
  var canvas = createCanvas(500, 450);
  boundary = new Boundary(); // initialize the boundary including target points on the corners
  score = new Score(); // initialize the scoring system including joint evaluation 
  active_brc_index = 0;
  brc[active_brc_index].setMoveActive();
  score.updateScore(); // initial calculation
}

function draw() {
  background(250);
  boundary.drawBoundary(); 
  boundary.drawActivePoints(4, color(255, 240, 0, 200));
  for (var i = 0; i < brc.length; i++){
    brc[i].drawBranch();
  }

  // score.updateScore(); // this function is not here to avoid getting heavy. instead, it's calculated in Events.js
  
  // show effect when the game is completed
  if (score.complete) {
    textSize(70);
    textFont("Helvetica");
    noStroke();
    textStyle(BOLD);
    fill(50);
    text("Connected!", 60, height/2+20);
    Stop();
  }
}


//以下、タイマー処理

  var timer = document.getElementById('time-container');
  var start = document.getElementById('time-container');

  //クリック時の時間を保持するための変数定義
  var startTime;

  //経過時刻を更新するための変数。 初めはだから0で初期化
  var elapsedTime = 0;

  //タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
  var timerId;

  //タイマーをストップ -> 再開させたら0になってしまうのを避けるための変数。
  var timeToadd = 0;


  //ミリ秒の表示ではなく、分とか秒に直すための関数, 他のところからも呼び出すので別関数として作る
  //計算方法として135200ミリ秒経過したとしてそれを分とか秒に直すと -> 02:15:200
  function updateTimetText(){

      //m(分) = 135200 / 60000ミリ秒で割った数の商　-> 2分
      var m = Math.floor(elapsedTime / 60000);

      //s(秒) = 135200 % 60000ミリ秒で / 1000 (ミリ秒なので1000で割ってやる) -> 15秒
      var s = Math.floor(elapsedTime % 60000 / 1000);


      //HTML 上で表示の際の桁数を固定する　例）3 => 03　、 12 -> 012
      //javascriptでは文字列数列を連結すると文字列になる
      //文字列の末尾2桁を表示したいのでsliceで負の値(-2)引数で渡してやる。
      m = ('0' + m).slice(-2); 
      s = ('0' + s).slice(-2);

      //HTMLのid　timer部分に表示させる　
      timer.textContent = m + ':' + s;
  }


  //再帰的に使える用の関数
  function countUp(){

      //timerId変数はsetTimeoutの返り値になるので代入する
      timerId = setTimeout(function(){

          //経過時刻は現在時刻をミリ秒で示すDate.now()からstartを押した時の時刻(startTime)を引く
          elapsedTime = Date.now() - startTime + timeToadd;
          updateTimetText()

          //countUp関数自身を呼ぶことで10ミリ秒毎に以下の計算を始める
          countUp();

      //1秒以下の時間を表示するために10ミリ秒後に始めるよう宣言
      },10);
  }

  setInterval(function(){
    if(timerflag){
      if(timerlaunch === true && timerflag === true){
        startTime = Date.now();
          //再帰的に使えるように関数を作る
        countUp();
        timerlaunch = false;
      }
    }
  },100);

  function Stop(){

      //タイマーを止めるにはclearTimeoutを使う必要があり、そのためにはclearTimeoutの引数に渡すためのタイマーのidが必要
    clearTimeout(timerId);


      //タイマーに表示される時間elapsedTimeが現在時刻かたスタートボタンを押した時刻を引いたものなので、
      //タイマーを再開させたら0になってしまう。elapsedTime = Date.now - startTime
      //それを回避するためには過去のスタート時間からストップ時間までの経過時間を足してあげなければならない。elapsedTime = Date.now - startTime + timeToadd (timeToadd = ストップを押した時刻(Date.now)から直近のスタート時刻(startTime)を引く)
    timeToadd += Date.now() - startTime;
  };

  window.onload = function(){

      //経過時刻を更新するための変数elapsedTimeを0にしてあげつつ、updateTimetTextで0になったタイムを表示。
      elapsedTime = 0;

      //リセット時に0に初期化したいのでリセットを押した際に0を代入してあげる
      timeToadd = 0;

      //updateTimetTextで0になったタイムを表示
      updateTimetText();
  };