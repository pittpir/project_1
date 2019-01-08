"use strict";


class Player {
	constructor(name,color) {
		this.name = name;
		this.color = color;
	}
}

class Move extends Player {
	constructor (name,color) {
		super(name,color);
		this.turn = "";
		this.x = 0;
	}

	newturn () {
		let whichturn = ["blue","red"];
		this.x++;
		if (this.x>1) { this.x = 0; }
		this.turn = whichturn[this.x];
		console.log(this.x);
		return this.turn;
	}
}

let player1 = new Player("Chris","blue");
let player2 = new Player("Cassie","red");
let flow = new Move();

flow.turn = "blue";
//console.log(flow.newturn());

//**************************************************************************************
//This creates the click function for the empty spaces on the board
//**************************************************************************************
//$( ".troubleBoard span" ).children().click(function() {
$( ".troubleBoard" ).children().click(function() {
	let x = $(this).index();
	movePieceInPlay($( ".troubleBoard span" ).children().eq(x),x);	
}); 

//**************************************************************************************
//Move a piece on the board
//**************************************************************************************
let diceCnt = 3;
function movePieceInPlay(obj,x) {
	let array1 = $( ".troubleBoard span" ).children();
	let moveCnt = diceCnt+x;
	let oldMoveCnt = 0;
	

	if (moveCnt > 27) {
		console.log(moveCnt);
		moveCnt = moveCnt - 28;
	}
	//let array2 = $( ".troubleBoard" ).children();
	//let x = $(array2).index();
	//console.log(array1);
	console.log(obj);
	let array = Object.entries(obj)[0];
	//console.log(array);
	console.log("Old Color: " + array[1].style.borderColor);
	let array2 = Object.entries(array1)[moveCnt];
	console.log("Position Ahead: " + array2[1].style.borderColor);
	//console.log("Order Ahead: " + array[1].style.order);
	console.log("Class Name: " + array[1].className);
	oldMoveCnt = parseFloat(array[1].style.order);
	array[1].style.order = (diceCnt + parseFloat(array[1].style.order));
	console.log("Order Ahead: " + array[1].style.order);

	if ((array[1].style.order > 28) && (array[1].style.order < 33)  ) {
		//goto into its base position
		console.log("Made it to base");   //-------------------------------------------------------------------------------------------------------------------------
		return 0;
	} else if (array[1].style.order > 33) {
		console.log("Cannot move");
		array[1].style.order = oldMoveCnt;
		return 0;
	}

	if (array[1].style.borderColor === array2[1].style.borderColor)
	{
		console.log("Cannot move as same color cannot occupy same space");
		array[1].style.order = oldMoveCnt;
		return 0;
	}

	//if  (array2[1].style.borderColor === "rgb(224, 224, 224)") 
	//{
	//	console.log("Swap");
	//	return 0;
	//}
	if (array2[1].style.borderColor === "blue") 
	{
		console.log("Send them Home");  //-------------------------------------------------------------------------------------------------------------------------
		return 0;
	}

	//let object = { div: obj };        //Note:  ES6 allows to set the key from a variable using the []
	//swapArray.push(object);
	//let sizeOfArray = swapArray.length;
	//if (sizeOfArray > 1) {
	//console.log(x)
	


		let cow = $( obj ).clone()
		let horse = $( array1[moveCnt] ).clone()
		//console.log(cow)
		//console.log(horse)

		//gotta put back the event
		$( obj ).replaceWith(horse);                   //.click( mess2(array1[moveCnt]),moveCnt);
		$( array1[moveCnt] ).replaceWith(cow);         //.click( mess2(obj),x);;
		array1[moveCnt] = cow;
		//swapArray = [];	
	//}
}

//**************************************************************************************
//This creates the click function for the player's home pieces
//**************************************************************************************
$( ".troubleHome" ).children().click(function() {
	let x = $(this).index();
	console.log(x);
	Home2Play(this, $( ".troubleHome span" ).children().eq(x),x);	
}); 

//************************************************************************************************
//Put Colors into play
//************************************************************************************************

let swapArray2 = [];
function Home2Play(mainObj,obj,x) {
	
//https://generalassembly.zoom.us/j/4831773973

//------------------------------------------------------------------------------------------------
//Need to place the OBJ into an array so I can parse out the DOM. Only need the 2nd elemnt in the array
//------------------------------------------------------------------------------------------------	
	let pickedColorArray = Object.entries(obj)[0];
	let ss = pickedColorArray[1].className;   //this should return the color of the peg that was picked
	
	//Is the player picking the correct color?
	if (ss !== flow.turn)
	{
		console.log("You cannot move this piece as it is not your Color");
		return 0;
	}


	let NewPositionArray = $( `.troubleBoard .${ss}Start` ).children();
	let arrayOut = Object.entries(NewPositionArray)[0];
	//console.log(arrayOut[1].style.borderColor);
		
	//if the same color is n this position then cannot move
	if (arrayOut[1].style.borderColor === pickedColorArray[1].className)
	{
		console.log("Cannot move");
		return 0;

	}

	//if another color occupies the space then send them home.
	if (arrayOut[1].style.borderColor === "blue")
	{
		console.log("Send them home");       //----------------------------------------------------------------------------------------------------------------------
		return 0;
	}

	//need to make a clone so I can swap the OBJs.
	let cow = $( pickedColorArray[1] ).clone()
	let horse = $( NewPositionArray[0] ).clone()

	//the click action resides on the span element and not the div element.
	$( pickedColorArray[1] ).replaceWith(horse);    //.click( mess2(array1[0]));
	$( NewPositionArray[0] ).replaceWith(cow);      //.click( mess2(obj));;
	$(mainObj).unbind();  //remove the action as the space is now empty
}





/*  //----------------------------------------------------------------------------------------------------------------------------
let swapArray = [];
function swap(obj) {
	console.log(obj);
	//console.log($(".div").prop('style'))
	//let cow = $( obj ).clone()
	//console.log(cow[0]);
	let object = { div: obj };        //Note:  ES6 allows to set the key from a variable using the []
	swapArray.push(object);
	//console.log(swapArray[0].div);


//$( ".div" ).clone().appendTo( ".div2" );

	let sizeOfArray = swapArray.length;
	//console.log(sizeOfArray);
	if (sizeOfArray > 1) {
		let cow = $( swapArray[0].div ).clone()
		//console.log(cow[0]);
		let horse = $( swapArray[1].div ).clone()
		//console.log(horse[0]);
		if (swapArray[0].div.style.borderColor === swapArray[1].div.style.borderColor) 
		{
			console.log("Same colors cannot occupy the same space");
			swapArray = [];
			return 0;
		}



//gotta put back the event
		$( swapArray[0].div ).replaceWith(horse).click( mess2(swapArray[1].div));
		$( swapArray[1].div ).replaceWith(cow).click( mess2(swapArray[0].div));;
		//$( swapArray[0].div ).bind( "click", function() { swap(swapArray[0].div); });

		//$( swapArray[0].div ).replaceWith(swapArray[0].div)
		//$( ".div" ).eq(swapArray[0].index).replaceWith(div);
		//$( ".div" ).eq(swapArray[1].index).replaceWith(cow[1]);
		//$( ".div" ).eq(swapArray[1].index).css(swapArray[0].css)
		swapArray = [];
		//mess();
		//console.log(swapArray[0].text);
	}
		//$( ".div" ).children().eq(swapArray[0]).text
}

*/ //----------------------------------------------------------------------------------------------------------------------------





/*

let swapArray2 = [];
function swap2(obj,x) {
	
	//let array2 = $( ".troubleBoard .blueStart" );
	//console.log(obj[0].div.style.borderColor);
	let object = { div: obj };        //Note:  ES6 allows to set the key from a variable using the []
	swapArray2.push(object);
	console.log(swapArray2[0]);
	console.log(swapArray2[0].div.style.borderColor);
	//console.log(obj.div.style.borderColor);
	let ss = swapArray2[0].div.style.borderColor;
	let array1 = $( `.troubleBoard .${ss}Start` ).children();
	console.log(array1);
		
	
	//console.log($(".div").prop('style'))
	//let cow = $( obj ).clone()
	//console.log(cow[0]);
	//let object = { div: obj };        //Note:  ES6 allows to set the key from a variable using the []
	//swapArray2.push(object);
	//console.log(swapArray[0].div);
	let cow = $( obj ).clone()
	let horse = $( array1[0] ).clone()
	//console.log(cow)
	//console.log(horse)
	$( obj ).replaceWith(horse);//.click( mess2(array1[0]));
	$( array1[0] ).replaceWith(cow);//.click( mess2(obj));;
}

*/


/*
function mess2(obj,x) {
	//console.log(obj);
	$( "." + obj.className ).eq(x).click(function() {
	//swap(this); 
	move(this);		
}); }
*/



/*
$( ".troubleHome span" ).children().click(function() {
	let x = $(this).index();
	console.log(x);
	//console.log(this);
	//console.log($( ".troubleBoard span" ).children().eq(x))

	swap2(this,x); 
	//swap2($( ".troubleHome span" ).children().eq(x),x);	
	//swap2($( ".troubleHome" ).children(),x);	
}); 
*/
















