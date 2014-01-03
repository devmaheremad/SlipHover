/*
* jquery sliphover 1.0
* A hover effect with direction aware jQuery plugin inspired by
* http://tympanus.net/TipsTricks/DirectionAwareHoverEffect/index2.html
*
* Author:Wayou
*
* Licensed under the MIT license.
*
* Bug reporting, suggestion, feature requirments, you can:
* mail to liuwayong@gmail.com
* or visit this project on github https://github.com/Wayou/SlipHover
*/

;(function($,window,document,undefined){

	'use strict';

    var SlipHover=function(element,options){

    	this.$element=element,
    	this.options=$.extend({},this.defaults,options)
	};

	SlipHover.prototype={
		defaults:{//no underscore means this is a public property that users can rewrite it as their own willing
			target:'img',//specify witch html tag the animation will apply on
			title:'title',//specify what information will be display when hover, the title or the alt of the image
			duration:'fast', //specify how long the animation will lasts in milliseconds
			fontColor:'#ffffff',
			backgroundColor:'rgba(0,0,0,.5)',//specify the background color and opacity using rgba
			reverse:false,
			delay:0,
			autoScroll:true,//if true, the overflowed long text of the overlay will auto scrolling up and down when hover
			scrollSpeed:30,//if autoScroll is true, this option specify the scroll speed, the smaller the fast
			height:'100%'//specify the height of the overlay
		},
		_overlayStyles:{
			normalStyle:{'left':'0','bottom':'0'},
			topStyle:{'left':'0','bottom':'100%'},
			rightStyle:{'left':'100%','bottom':'0'},
			bottomStyle:{'left':'0','bottom':'-100%'},
			leftStyle:{'left':'-100%','bottom':'0'}
		},
		_ini:function(element,options){//the underscore indicates this is a private method

			var that=this,
				$element=element||this.$element,
				options=options||this.options,
				$targets=$element.find(options.target).size()>0?$element.find(options.target):$element;

			$targets.each(function(){

				var $container=that._createContainer($(this)),
					$overlay=that._createOverlay($container,options,$(this)),
					$innerContainer=$overlay.children(),
					contentHeight=$innerContainer.height(),
					overlayHeight=$overlay.height();

				that._listenEvent($container,$overlay,options);

				//if the text is overflow and the autoScroll options is set to true then auto scroll
				if (that.options.autoScroll&&contentHeight-overlayHeight>0) {

					$overlay.css('overflow','hidden');

					var scrollTop={top:-(contentHeight-overlayHeight)},
					scrollBottom={top:0},
					speed=(contentHeight-overlayHeight)*that.options.scrollSpeed;

					$overlay.hover(function(){
							that._alternateScroll($innerContainer,scrollTop,scrollBottom,speed);
						},function(){
							$overlay.children().stop().css('top','0');
						})
				};
			});

			return $element;
		},
		_alternateScroll:function($element,ani1,ani2,speed){
			var that=this;
			$element.animate(ani1,speed,'linear',function(){
					$element.animate(ani2,speed,'linear',function(){
						that._alternateScroll($element,ani1,ani2,speed);
					});
				});
		},
		_createContainer:function($target){

			var targetOffset=$target.offset(),
			targetWidth=$target.innerWidth(),
			targetHeight=$target.innerHeight(),
			borderWidth=($target.outerWidth()-$target.innerWidth())/2;

			return $('<div class="sliphoveritem" style="width:'+targetWidth+'px;height:'+targetHeight+'px;text-align:center;overflow:hidden;position:absolute;top:'+(targetOffset.top+borderWidth)+'px;left:'+(targetOffset.left+borderWidth)+'px;">').insertBefore($target);
		},
		_createOverlay:function($container,options,$target){
			var $overlay=$('<div class="sliphoveritemTitle" style="width:100%;height:'+this.options.height+';box-sizing:border-box;-moz-box-sizing:border-box;padding:5px;overflow:auto;position:absolute;color:'+this.options.fontColor+';background-color:'+this.options.backgroundColor+';">')
			.html('<div style="position:relative;width:100%;">'+$target.attr(options.title)+'</div>')
			.css(this._overlayStyles.leftStyle),
				$innerContainer=$overlay.children();

			 $container.html($overlay);

			 //if the content's height is less that the overlay, set the content vertical align middle
			if ($innerContainer.height()<$overlay.height()) {
				$innerContainer.css({'width':$innerContainer.width(),'height':$overlay.height(),'display':'table-cell','vertical-align':'middle','text-align':'center'});
			};
			
			 return $overlay;
		},
		_getDirection:function($target,event){

			//reference: http://stackoverflow.com/questions/3627042/jquery-animation-for-a-hover-with-mouse-direction
				var w = $target.width(),
					h = $target.height(),

					x = ( event.pageX - $target.offset().left - ( w/2 )) * ( w > h ? ( h/w ) : 1 ),
					y = ( event.pageY - $target.offset().top  - ( h/2 )) * ( h > w ? ( w/h ) : 1 ),
				
					direction = Math.round( ( ( ( Math.atan2(y, x) * (180 / Math.PI) ) + 180 ) / 90 ) + 3 ) % 4;
					return direction;

		},
		_listenEvent:function($target,$overlay,options){
			var that=this;
			$target.unbind('mouseenter.sliphover mouseleave.sliphover').bind('mouseenter.sliphover mouseleave.sliphover',function(e){

				var eventType=e.type,
				    direction=that._getDirection($target,e);
				that._applyAnimation(eventType,direction,$overlay,options,that._overlayStyles);
			});
		},
		_applyAnimation:function(eventType,direction,$overlay,options,styles){

			if (options.reverse) {direction=(direction+2)%4};//this trick convert 0 to 2,1 to 3 ，vice versa to reverse the animation

			switch(direction) {
			 case 0:
			  /** animations from the TOP **/
				if (eventType=='mouseenter') {
					$overlay.css(styles.topStyle);
					$overlay.stop().animate(styles.normalStyle,options.duration);
				}else{
					$overlay.stop().animate(styles.topStyle,options.duration);
				}

			 break;
			 case 1:
			  /** animations from the RIGHT **/
			  if (eventType=='mouseenter') {
					$overlay.css(styles.rightStyle);
					$overlay.stop().animate(styles.normalStyle,options.duration);
				}else{
					$overlay.stop().animate(styles.rightStyle,options.duration);
				}

			 break;
			 case 2:
			  /** animations from the BOTTOM **/
			  if (eventType=='mouseenter') {
					$overlay.css(styles.bottomStyle);
					$overlay.stop().animate(styles.normalStyle,options.duration);
				}else{
					$overlay.stop().animate(styles.bottomStyle,options.duration);
				}

			 break;
			 case 3:
			  /** animations from the LEFT **/
			  if (eventType=='mouseenter') {
					$overlay.css(styles.leftStyle);
					$overlay.stop().animate(styles.normalStyle,options.duration);
				}else{
					$overlay.stop().animate(styles.leftStyle,options.duration);
				}

			 break;
			 default:
			 	throw new Error('failed to get the direction.');
			}
		}
	};

	SlipHover.constructor=SlipHover;//fix the prototype link

	$.fn.sliphover=function(options){

		var entry=$.data(this,'sliphover');

		if (!entry) {
			entry=new SlipHover(this,options);
			entry._ini();
			$.data(this,'sliphover',entry);
		}else{
			entry._ini(this,options);
		}

		//handle the window resize event for it will destroy the layout
		$( window ).unbind('resize.sliphover').bind('resize.sliphover',function() {
			$('.sliphoveritem').remove();
			entry._ini();
		});

		return entry;
	};

}(jQuery,window,document));