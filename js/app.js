"use strict";

console.log("Test");

//$( ".alien_pics" ).children()

$( ".redPiece, .noPiece" ).children().click(function() {
	//let x = $(this).index();
	swap(this); 	
}); 


function mess2(obj) {
	//console.log(obj.className);
	$( "." + obj.className ).click(function() {
	swap(this); 	
}); }



let swapArray = [];
function swap(obj) {
	//console.log(x);
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
		console.log(cow[0]);
		let horse = $( swapArray[1].div ).clone()
		console.log(horse[0]);


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
