"use strict";
//instruction link
//https://www.hasbro.com/common/instruct/Trouble_(2002).pdf

class Player {
	constructor(name,color) {
		this.name = name;
		this.color = color;
		this.win = 0;
	}
}

class Move extends Player {
	constructor (playerArray,name,color) {
		super(name,color);
		this.turn = "";
		this.maxX = playerArray.length-1;
		this.x = 0;
		this.playerArray = playerArray;
		this.diceCnt = 6;
		this.spinDice = false;
	}

	newturn () {		
		this.turn = playerArray[this.x];
		console.log(playerArray);
		$(".whosTurnNow").text(this.turn.name + "'s turn color " + this.turn.color);
		$(".whosTurnNow").css("color", this.turn.color);
		$(".pass").css("background-color", this.turn.color);
		$(".spin").css("background-color", this.turn.color);
		
		if (this.turn.color === "yellow") {
			$(".pass").css("color", "black");
			$(".spin").css("color", "black");
		} else {
			$(".pass").css("color", "white");
			$(".spin").css("color", "white");
		}

		this.x++;
		if (this.x>this.maxX) { this.x = 0; }
		this.spinDice = false;
		statusOut(`Please Spin the Dice!`);
		return this.turn.color;
	}
}

let flow = 0;
let playerArray = [];

//**************************************************************************************
//This is the startGame Click function.  Determines how many players exist and which color
//was selected for each player.  Will bark if same color is chosen or if less than 2 players. 
//**************************************************************************************
$( ".startGame" ).click(function() {
	let flag = 0;
	let color = [];
	let color2 = "";
	$( "select" ).filter(function (index) {
		color2 = this.value;
		let found = color.find(function(element) {
  			if (element === color2) {
  				statusOut(`The color ${color2} has already been picked.  Please select a different color`);
				flag = 1;
				return 0;
  			}
  			return 0;
		});

		color.push(this.value);
		return 0;
	});
	
	if (flag) return 0;

	$( "input" ).filter(function (index) {
		if (this.value !== "") {
			color = ( $("#color" + this.className)[0].value);
			
			playerArray.push(new Player(this.value, color));
		}
		return 0;
	});
	
	if ((playerArray.length < 2))
	{
		statusOut(`Must have 2+ players to begin!`);
		return 0;
	}

	flow = new Move(playerArray);
	
	$( ".startGame" ).prop("disabled", "true");
	$(".startGame").css("background-color", "grey");
	flow.newturn();
	return 0;
}); 




//**************************************************************************************
//This updates the Status dialog section.  Will flash when new message appears.
//**************************************************************************************
function statusOut (text) {
	$( ".statusOut" ).text(text);
	$('.statusOut').fadeOut(500);
    $('.statusOut').fadeIn(500);
    return 0;
}

//**************************************************************************************
//Pass Function  
//**************************************************************************************
$( ".pass" ).click(function() {
	
	if (flow.spinDice) {
		flow.spinDice = false;
		flow.newturn();
		return 0;
	} else {
		statusOut(`Please Spin the Dice!`);
	}

	return 0;
}); 

//**************************************************************************************
//This is the dice.  Add the click function to the button.  
//**************************************************************************************
$( ".spin" ).click(function() {
	
	if (flow.spinDice) {
		statusOut(`You already spun the dice!`);
		return 0;
	}

	let diceCnt = Math.floor(Math.random() * (7 - 1) + 1);
	
	if (diceCnt === 6)
		$(".dicePic").prop("src","pictures/six_small.png").effect( "shake", 400 );
	if (diceCnt === 5)
		$(".dicePic").prop("src","pictures/five_small.png").effect( "shake", 400 );
	if (diceCnt === 4)
		$(".dicePic").prop("src","pictures/four_small.png").effect( "shake", 400 );
	if (diceCnt === 3)
		$(".dicePic").prop("src","pictures/three_small.png").effect( "shake", 400 );
	if (diceCnt === 2)
		$(".dicePic").prop("src","pictures/two_small.png").effect( "shake", 400 );
	if (diceCnt === 1)
		$(".dicePic").prop("src","pictures/one_small.png").effect( "shake", 400 );

	if (typeof(flow) !== "number") {
		flow.diceCnt = diceCnt;
		flow.spinDice = true;
	}
	$(".spin").css("background-color", "rgb(224, 224, 224)");
	
	return 0;
}); 


//**************************************************************************************
//This creates the click function for the empty spaces on the board
//**************************************************************************************
$( ".troubleBoard" ).children().click(function() {
	let x = $(this).index();
	movePieceInPlay($( ".troubleBoard span" ).children().eq(x),x);	
}); 

//**************************************************************************************
//Move a piece on the board
//**************************************************************************************
//let diceCnt = 3;
function movePieceInPlay(obj,x) {
	let newPositionArray = $( ".troubleBoard span" ).children();
	let moveCnt = flow.diceCnt+x;
	let oldMoveCnt = 0;

	if (typeof(flow) === "number") {
		statusOut(`Please Start the Game`);
		return 0;
	}

	if (flow.spinDice === false) {
		statusOut(`Please Spin the Dice!`);
		return 0;
	}
	

	if (moveCnt > 27) {
		moveCnt = moveCnt - 28;
	}

	let currentPosition = Object.entries(obj)[0];
	let ss = currentPosition[1].className;   //this should return the color of the peg that was selected
	
	//Is the player picking the correct color?
	if (ss !== flow.turn.color)
	{
		statusOut(`${flow.turn.name} -- you cannot move this piece as it is not your Color`);
		//$( ".statusOut" ).text(`${flow.turn.name} -- you cannot move this piece as it is not your Color`);
		return 0;
	}

	let newPosition = Object.entries(newPositionArray)[moveCnt];
	oldMoveCnt = parseFloat(currentPosition[1].style.order);    
	currentPosition[1].style.order = (flow.diceCnt + oldMoveCnt);

	if ((currentPosition[1].style.order > 28) && (currentPosition[1].style.order < 33)  ) {
		//goto into its base position
		let ret = move2Base(currentPosition[1],currentPosition[1].style.order);
		if (!ret) {
			statusOut(`Congrat ${flow.turn.name} -- you made a piece to base!`);
			//$( ".statusOut" ).text(`Congrat ${flow.turn.name} -- you made a piece to base!`);
			flow.newturn();
			return 0;
		} else if (ret == 1) {
			statusOut(`${flow.turn.name} -- you have a piece already in the base at the given space.  Pick another piece or pass.`);
			currentPosition[1].style.order = oldMoveCnt;
			return 0;
		} else {
			statusOut(`${flow.turn.name} -- won the Game`);
			$(".whosTurnNow").text(`${flow.turn.name} -- won the Game`);
			alert(`${flow.turn.name} -- won the Game`);
			$(".troubleBoard").unbind();
			$(".troubleHome").unbind();
			$(".spin").unbind();
			$(".pass").unbind();
			return 0;
		}		
	} else if (currentPosition[1].style.order > 32) {
		statusOut(`${flow.turn.name} -- you rolled too high and overshot the base.`);
		//$( ".statusOut" ).text(`${flow.turn.name} -- you rolled too high and overshot the base.`);
		currentPosition[1].style.order = oldMoveCnt;
		return 0;
	}

	if (currentPosition[1].style.borderColor === newPosition[1].style.borderColor)
	{
		statusOut(`${flow.turn.name} -- same color cannot occupy the same space.`);
		//$( ".statusOut" ).text(`${flow.turn.name} -- same color cannot occupy the same space.`);
		currentPosition[1].style.order = oldMoveCnt;
		return 0;
	}

	if (newPosition[1].style.borderColor !== "rgb(224, 224, 224)") 
	{
		sendThemHome(newPosition[1]);
		movePieceInPlay(obj,x)
		return 0;
	}

		let cow = $( obj ).clone()
		let horse = $( newPositionArray[moveCnt] ).clone()

		//gotta put back the event
		$( obj ).replaceWith(horse);
		$( newPositionArray[moveCnt] ).replaceWith(cow);
		newPositionArray[moveCnt] = cow;
		
		if (flow.diceCnt === 6) {
			statusOut(`${flow.turn.name} -- Can Spin again`);
			$(".spin").css("background-color", flow.turn.color);
			flow.spinDice = false;
			return 0;
		}

		flow.newturn();
}

//**************************************************************************************
//This creates the click function for the player's home pieces
//**************************************************************************************
$( ".troubleHome" ).children().click(function() {
	let x = $(this).index();
	//console.log(x);
	Home2Play(this, $( ".troubleHome span" ).children().eq(x),x);	
}); 

//************************************************************************************************
//Put Colors into play
//************************************************************************************************
let swapArray2 = [];
function Home2Play(mainObj,obj,x) {

	if (typeof(flow) === "number") {
		statusOut(`Please Start the Game`);
		return 0;
	}

	if (flow.spinDice === false) {
		statusOut(`Please Spin the Dice!`);
		return 0;
	}
	if (flow.diceCnt !== 6) {
		statusOut(`Cannot move piece out of home unless dice is a 6!  Press Pass if you have no moves!`);
		return 0;
	}

//------------------------------------------------------------------------------------------------
//Need to place the OBJ into an array so I can parse out the DOM. Only need the 2nd elemnt in the array
//------------------------------------------------------------------------------------------------	
	let pickedColorArray = Object.entries(obj)[0];
	let ss = pickedColorArray[1].className;   //this should return the color of the peg that was picked


	
	//Is the player picking the correct color?
	if (ss !== flow.turn.color)
	{
		statusOut(`${flow.turn.name} -- you cannot move this piece as it is not your Color`);
		//$( ".statusOut" ).text(`${flow.turn.name} -- you cannot move this piece as it is not your Color`);
		return 0;
	}


	let NewPositionArray = $( `.troubleBoard .${ss}Start` ).children();
	let arrayOut = Object.entries(NewPositionArray)[0];
	//console.log(arrayOut[1].style.borderColor);
		
	//if the same color is in this position then cannot move
	if (arrayOut[1].style.borderColor === pickedColorArray[1].className)
	{
		statusOut(`${flow.turn.name} -- you cannot move a piece out of home.  Try another piece or pass`);
		//$( ".statusOut" ).text(`${flow.turn.name} -- you cannot move a piece out of home.  Try another piece or pass`);
		return 0;
	}

	//if another color occupies the space then send them home.
	if (arrayOut[1].style.borderColor !== "rgb(224, 224, 224)")
	{
		sendThemHome(arrayOut[1]);
		Home2Play(mainObj,obj,x)
		return 0;
	}

	//need to make a clone so I can swap the OBJs.
	let cow = $( pickedColorArray[1] ).clone()
	let horse = $( NewPositionArray[0] ).clone()

	//the click action resides on the span element and not the div element.
	$( pickedColorArray[1] ).replaceWith(horse);
	$( NewPositionArray[0] ).replaceWith(cow);
	$(mainObj).unbind();  							//remove the action as the space is now empty
	
	if (flow.diceCnt === 6) {
		statusOut(`${flow.turn.name} -- Can Spin again`);
		$(".spin").css("background-color", flow.turn.color);
		flow.spinDice = false;
		return 0;
	}

	flow.newturn();
}

//************************************************************************************************
//Put Colors into Base from the play area
//************************************************************************************************
function move2Base (mainArr,diceCnt) {
	let obj = {}

//-----------------------------------------------------------------------------------------------
//Filter out the children under trouble home.  It will return 16 children whereas only 4 apply 
//to the specific color.
//-----------------------------------------------------------------------------------------------
	let newPositionArray = $( ".troubleBase" ).children().filter(function( index ) {	
    	//filter out the proper color bases
    	let moo = diceCnt - 28;
    	let text = mainArr.style.borderColor + "Base" + moo;
    	
    	if ( this.className.startsWith(text) )
    	{
    		obj = $("." + this.className).children().eq(0);
    		return this;
    	} 
  	}) 
	
	let pickedColorArray = Object.entries(obj)[0];
	
	//if the same color is in this position then cannot move
	if (mainArr.style.borderColor === pickedColorArray[1].style.borderColor)
	{
		statusOut(`${flow.turn.name} -- You cannot move this piece to base.  Try another piece or pass`);
		//$( ".statusOut" ).text(`${flow.turn.name} -- You cannot move this piece to base.  Try another piece or pass`);
		return 1;
	}

	let cow = $( mainArr ).clone()
	let horse = $( obj ).clone()

	//the click action resides on the span element and not the div element.
	$( mainArr ).replaceWith(horse);
	$( obj ).replaceWith(cow);

//determine a winner ----------------------------------------------------------------------------------------------------------------------------------------------------------------
	flow.turn.win = flow.turn.win + 1;
	if (flow.turn.win === 4)
	{
		return 5;
	}

	return 0;
}

//************************************************************************************************
//Return colors to home base after being trampled upon from another piece
//************************************************************************************************
function sendThemHome (mainArr) {
	let obj = {};
	let objTest = {};
	let brokenHome = [];
	//console.log(mainArr);
	mainArr.style.order = 1;

//-----------------------------------------------------------------------------------------------
//Filter out the children under trouble home.  It will return 16 children whereas only 4 apply 
//to the specific color.
//-----------------------------------------------------------------------------------------------
	let newPositionArray = $( ".troubleHome" ).children().filter(function( index ) {
    	let text = mainArr.style.borderColor + "Home";
    	
    	if ( this.className.startsWith(text) )
    	{
    		objTest = $("." + this.className).children().eq(0);
    		brokenHome = Object.entries(objTest)[0];  //take the object and flatens it into an array.  This allows me to parse the DOM.

    		if (brokenHome[1].style.borderColor === "rgb(224, 224, 224)") {
    			obj = $("." + this.className).children().eq(0);
    			$(this).click(function() { let x = $(this).index(); Home2Play(this, $( ".troubleHome span" ).children().eq(x),x);	 });
    		}	
    		return this;
    	} 
  	}) 
	
	let pickedColorArray = Object.entries(obj)[0];
		
	//if the same color is in this position then cannot move
	if (mainArr.style.borderColor === pickedColorArray[1].style.borderColor)
	{
		statusOut(`${flow.turn.name} -- You cannot move this piece to base.  Try another piece or pass`);
		//$( ".statusOut" ).text(`${flow.turn.name} -- You cannot move this piece to base.  Try another piece or pass`);
		return 1;
	}

	let cow = $( mainArr ).clone()
	let horse = $( obj ).clone()

	//the click action resides on the span element and not the div element.
	$( mainArr ).replaceWith(horse);    //.click( mess2(array1[0]));
	$( obj ).replaceWith(cow);      //.click( mess2(obj));;

	return 0;
}

