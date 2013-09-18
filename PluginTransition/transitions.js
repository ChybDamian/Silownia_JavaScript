var currentlyAnimating = [];

(function($){
	$.fn.transition = function( options ){
		var settings = $.extend( true, {
			parent : $(this).parent(),
			which : "next",
			duration : 700,
			animType : [ "slide", "right", false ], // typ - pozycja startowa - false(skalowanie) || animuj w tą stronę element znikający
			loop : true
		}, options ),

			parentWidth = settings.parent.width(),
			parentHeight = settings.parent.height(),
			current = $( ".current", settings.parent ),
			currentHeight = current.height(),
			currentWidth = current.width(),
			currentOpacity = current.css( "opacity" ),
			elementToAppear = undefined,
			pages = $(".page", settings.parent );
			directions = {
				bottomLeft : [ 0-parentWidth, parentHeight ],
				bottom : [ 0, parentHeight ],
				bottomRight : [ parentWidth, parentHeight ],
				left : [ 0-parentWidth, 0 ],
				right : [ parentWidth , 0 ],
				topLeft : [ 0-parentWidth, 0-parentHeight ],
				top : [ 0, 0-parentHeight ],
				topRight : [ parentWidth, 0-parentHeight ]
			};

		for( var x in currentlyAnimating ){
			if( currentlyAnimating[x] === settings.parent.selector ){
				return false;
			}
		}

		var	methods = {
				slide : function(){
					currentlyAnimating.push( settings.parent.selector );

					var animateOptions = {
						easing : "linear",
						duration : settings.duration,
						queue : false,
						complete : function(){
							resetCurrent();
						}
					}

					current
						.css( "z-index", -1 )
						.animate({ opacity: 0.5 }, settings.duration/3 );		// przezroczystosc

						if( settings.animType[2] ){
							current
								.animate({					//skalowanie w  dół
									width: 0,
									height: 0,
									"top": parentHeight/2,
									"left": parentWidth/2
								}, animateOptions );
						}
						else{
							current.animate({											// animuj w przeciwnym kierunku
								"left" : directions[ settings.animType[1] ][0] *-1, 	//*-1 odwraca liczby dodatnie na ujemne i na odwrót
								"top" : directions[ settings.animType[1] ][1] *-1
							}, animateOptions );
						}

					elementToAppear
						.css({
							"left" : directions[ settings.animType[1] ][0],
							"top" : directions[ settings.animType[1] ][1]
						})
						.addClass("current")
						.animate({
							"left" : 0,
							"top" : 0
						},
						{
							duration : settings.duration,
							queue : false,
							easing : "linear",
							complete : function(){
								resetCurrent();

								currentlyAnimating.splice( currentlyAnimating.indexOf(settings.parent.selector), 1 );
							}
						});
				},
				fadeThrough : function(){
					currentlyAnimating.push( settings.parent );

					elementToAppear
						.css({
							"left" : 0,
							"top" : 0,
							"z-index" : 1,
							opacity : 0 })
						.addClass("current")
						.animate({
							opacity : 1
						}, settings.duration, function(){
							current.removeClass("current");
							$(this).css( "z-index", 0 );
						});
				}
		};

		function resetCurrent(){
			current.css({
				height : currentHeight,
				width : currentWidth,
				opacity : currentOpacity
			});
			current.removeClass("current");
		}

		// elementToAppear

		if( typeof settings.which === "number" ){
			elementToAppear = pages.eq( settings.which );
		}
		else{
			elementToAppear = settings.which === "next"? current.next(".page") : current.prev(".page");
		}


		// petla

		if( !elementToAppear.attr("class") ){
			if( settings.loop ){
				elementToAppear = settings.which === "next"? pages.first() : pages.last();
			}
			else{
				return false;
			}
		}

		// egzekucja
		console.log( currentlyAnimating );

		if( settings.animType instanceof Array ){
			methods[ settings.animType[0] ]();
		}
		else{
			methods[ settings.animType ]();
		}
	}

	return this;

})(jQuery);



$(function(){

	$(".page").click(function(){
		$(this).transition();
	});

	$("#next").click(function(){
		$(this).transition({ parent : $("#wrap"), animType : [ "slide", "top", true ] });
	});
	$("#prev").click(function(){
		$(this).transition({ parent : $("#wrap"), which : "next", animType : [ "slide", "bottom", false ] });
	})
});
