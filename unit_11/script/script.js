
window.onload = function(){
	console.log = console.log || alert;
	var element = document.querySelector('#ctn');
	var handler = function( e ){
		console.log(e );
		alert(e)
	};
	
	addEvent(element, 'click', handler);
	
}