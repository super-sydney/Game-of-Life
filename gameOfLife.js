var canv = document.getElementById("canv"), c = canv.getContext("2d"), 
	WIDTH = 50, HEIGHT = 50;

var g, width = 10, height = 10, freq = 0, seed, interval;

function init(){
	width = 10; 
	height = 10;
	WIDTH = 50;
	HEIGHT = 50;
	freq = 0;
	if (document.getElementById("width").value !== "" && !isNaN(parseFloat(document.getElementById("width").value))){
		width = parseFloat(document.getElementById("width").value);
	}
	if (document.getElementById("widthPx").value !== "" && !isNaN(parseFloat(document.getElementById("widthPx").value))){
		WIDTH = parseFloat(document.getElementById("widthPx").value);
	}
	if (document.getElementById("height").value !== "" && !isNaN(parseFloat(document.getElementById("height").value))){
		height = parseFloat(document.getElementById("height").value);
	}
	if (document.getElementById("heightPx").value !== "" && !isNaN(parseFloat(document.getElementById("heightPx").value))){
		HEIGHT = parseFloat(document.getElementById("heightPx").value);
	}
	if (document.getElementById("freq").value !== "" && !isNaN(parseFloat(document.getElementById("freq").value))){
		freq = parseFloat(document.getElementById("freq").value);
	}

	if (document.getElementById("seed").value !== ""){
		seed = JSON.parse(atob(document.getElementById("seed").value));
		if (seed.constructor == Array){
			width = seed[0];
			height = seed[1];
			WIDTH = seed[2];
			HEIGHT = seed[3];
			freq = seed[4];
		}
	}

	if (!(isNaN(width) || isNaN(height) || isNaN(WIDTH) || isNaN(HEIGHT) || isNaN(freq))){
		document.getElementById("submit").style.display = "initial";
		for (var i = 0; i < height; i++){
			for (var j = 0; j < width; j++){
				var b = document.createElement("button");
				b.onclick = function(){
					if (this.style.backgroundColor === "white"){
						this.style.backgroundColor = "black";
						this.value = 1;
					}else{
						this.style.backgroundColor = "white";
						this.value = 0;
					}
				};
				b.style = "background-color: white; border: 2px solid black; width: 50px; height: 50px;"
				b.value = 0;
				document.getElementById("setup").append(b);
			}
			document.getElementById("setup").append(document.createElement("br"));
		}
		document.getElementById("initial").style.display = "none";
	}else{
		alert("Something went very wrong");
		console.log(width, height, WIDTH, HEIGHT, freq)
	}
}

function submit(){
	var buttons = document.getElementById("setup").getElementsByTagName("button"), arr = [], counter = 0;

	for (var i = 0; i < height; i++){
		arr.push(new Array(width));
	}

	for (var i = 0; i < height; i++){
		for (var j = 0; j < width; j++){
			arr[i][j] = parseFloat(buttons[counter].value);
			counter++;
		}
	}

	document.getElementById("submit").style.display = "none";
	document.getElementById("setup").style.display = "none";
	document.getElementById("next").style.display = "initial";

	if (seed && seed.constructor == Array){
		g = new Game(width, height, seed[5]);
	}else{
		g = new Game(width, height, arr);
	}

	g.draw();
	document.getElementById("freqSlider").value = freq;
	document.getElementById("freqSlider").style.display = "initial";
	if (freq !== 0){
		interval = setInterval(function(){g.next()}, freq*1000);
	}
}

class Game{
	constructor(width, height, initial){
		this.board = JSON.parse(JSON.stringify(initial));
		this.tempBoard = JSON.parse(JSON.stringify(initial));
		this.width = width;
		this.height = height;

		canv.width = width*WIDTH;
		canv.height = height*WIDTH;

		document.getElementById("canv").style.display = "initial";
		document.getElementById("getSeed").value = btoa(JSON.stringify([width, height, WIDTH, HEIGHT, freq, this.board]));
		document.getElementById("getSeed").style.display = "initial";
		document.getElementById("seedDiv").style.display = "initial";
	}

	draw(){
		let counter = 0;
		c.fillStyle = "white"
		c.fillRect(0, 0, this.width*WIDTH, this.height*HEIGHT);
		c.fillStyle = "black"
		this.board.forEach(function(val){
			for (var i = 0; i < val.length; i++){
				if (val[i] === 1){
					c.fillRect(i*WIDTH, counter*HEIGHT, WIDTH, HEIGHT)
				}
				c.rect(i*WIDTH, counter*HEIGHT, WIDTH, HEIGHT);
			}
			counter++;
		});
		c.stroke();
	}

	next(){
		clearInterval(interval);
		freq = 1/(document.getElementById("freqSlider").value);
		if (freq !== 0){
			interval = setInterval(function(){g.next()}, freq*1000);
		}
		this.tempBoard = JSON.parse(JSON.stringify(this.board))
		c.fillStyle = "green";
		c.font = "10px Verdana";

		for (var i = 0; i < this.height; i++){
			for (var j = 0; j < this.width; j++){
				var alive = 0;
				for (var k = -1; k < 2; k++){
					for (var m = -1; m < 2; m++){

						if (i+k <= -1 || j+m <= -1 || i+k > this.height-1 || j+m > this.width-1 || (k === 0 && m === 0) ){
							continue
						}

						if (this.tempBoard[i+k][j+m] === 1){
							alive++;
						}


					}
				}

				if (this.tempBoard[i][j] === 1 && alive >= 4){
					this.board[i][j] = 0;
				}else if (this.tempBoard[i][j] === 1 && alive <= 1){
					this.board[i][j] = 0;
				}else if (this.tempBoard[i][j] === 0 && alive === 3){
					this.board[i][j] = 1;
				}
			}
		}
		c.fillStyle = "black"
		g.draw();
	}
}

