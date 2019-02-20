const canv = document.getElementById("canv"), c = canv.getContext("2d"), 
	WIDTH = 50, HEIGHT = 50;

var g, width, height;
function init(){
	width = parseInt(document.getElementById("width").value); 
	height = parseInt(document.getElementById("height").value);

	if (width && height){
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
	}else{
		alert("Please enter the width and height");
	}
}

function submit(){
	var buttons = document.getElementById("setup").getElementsByTagName("button"), arr = [], counter = 0;

	for (var i = 0; i < height; i++){
		arr.push(new Array(width));
	}
console.log(parseInt(buttons[counter].value), arr)
	for (var i = 0; i < height; i++){
		for (var j = 0; j < width; j++){
			arr[i][j] = parseInt(buttons[counter].value);
			counter++;
		}
	}

	document.getElementById("submit").style.display = "none";
	document.getElementById("setup").style.display = "none";
	document.getElementById("initial").style.display = "none";

	console.table(arr);

	g = new Game(width, height, arr);
	g.draw();

}

class Game{
	constructor(width, height, initial){
		this.board = initial;
		this.tempBoard = initial;
		this.width = width;
		this.height = height;

		canv.width = width*WIDTH;
		canv.height = height*WIDTH;
	}

	draw(){
		let counter = 0;
		c.fillStyle = "white"
		c.fillRect(0, 0, this.width*50, this.height*50);
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
		console.table(this.tempBoard)
		console.table(this.board)
		for (var i = 0; i < this.height; i++){
			for (var j = 0; j < this.width; j++){
				let alive = 0;

				if (i-1 >= 0 && j-1 >= 0){
					if (this.tempBoard[i-1][j-1] === 1){
						alive++;
						console.log(i-1, j-1)
					}
				} 
				if (i-1 >= 0){
					if (this.tempBoard[i-1][j] === 1){
						alive++;
						console.log(i-1, j)
					}
					if (j+1 < this.tempBoard[0].length){
						if (this.tempBoard[i-1][j+1] === 1){
							alive++;
							console.log(i-1, j+1)
						}
					}

				}
				if (j-1 >= 0){
					if (this.tempBoard[i][j-1] === 1){
						alive++;
						console.log(i, j+1)
					}
					if (i+1 < this.tempBoard.length){
						if (this.tempBoard[i+1][j-1] === 1){
							alive++;
							console.log(i+1, j-1)
						}
					}
				}
				if (j+1 < this.tempBoard[0].length){
					if (this.tempBoard[i][j+1] === 1){
							alive++;
							console.log(i, j+1)
					}

				}
				if (i+1 < this.tempBoard.length){
					if (this.tempBoard[i+1][j] === 1){
							alive++;
							console.log(i+1, j)
					}
				}
				if (j+1 < this.tempBoard[0].length && i+1 < this.tempBoard.length){
					if (this.tempBoard[i+1][j+1] === 1){
							alive++;
							console.log(i+1, j+1)
					}
				}
				

				console.log("result: " + alive, i, j)
				console.table(this.tempBoard)
				console.table(this.board)
				if (this.tempBoard[i][j] === 1 && alive <= 1){
					this.board[i][j] = 0;
				}else if (this.tempBoard[i][j] === 1 && alive >= 4){
					this.board[i][j] = 0;
				}else if (this.tempBoard[i][j] === 0 && alive === 3){
					this.board[i][j] = 1;
				}
			}
		}

		this.draw();
	}
}