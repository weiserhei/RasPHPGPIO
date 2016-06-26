/**
 *	Globe Class
 *	creating the earth and stuffs
 */

define([
       "three",
       "camera",
       "renderer",
], function ( THREE, camera, renderer ) {

	function ColorWheel( svgContainer, mesh, scope ) {

		this.svgContainer = svgContainer[ 0 ];
		svgContainer.hide();

		// fade wheel back out by clicking container
		svgContainer[0].onclick = function(){ $(this).fadeOut(); };

		var numberOfSegments = 8;
		var size = 360 / numberOfSegments;

		//red, black violet, white, yellow, blue, green
		var ledStatus = [[1, 0, 0], [1, 1, 1], [0, 0, 0], [1, 0, 1], [0, 0, 1], [0, 1, 1], [0, 1, 0], [1, 1, 0]]
		var offset = 360/30;

		for( var i = 0; i < numberOfSegments; i ++ ) {

			var lineSegment = createLineSeg( svgContainer, ledStatus[ i ] );

			var width = this.svgContainer.style.width.replace("px", "");
			var height = this.svgContainer.style.height.replace("px", "");
			// TODO
			// replace centerX, centerY with position of RGB LED
			annularSector( lineSegment, {
				centerX:width / 2, centerY:height / 2,
				startDegrees: i * size + offset, endDegrees: (i * size + size) + offset,
				innerRadius:85, outerRadius:130
			});
		}

		function createLineSeg( container, ledState ) {

			// !IMPORTANT
			// this == the LED Object
			
			var hexColor = convert( ledState );
			//lineSegment.style.fill = "#" + convert(current);
			var fillColor = colorManipulation( hexColor, 0.7 );

			var lineSegment = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
			lineSegment.classList += "shape";
			container[0].appendChild( lineSegment );

			lineSegment.style.fill = fillColor;

			lineSegment.onclick = function() {

				var LEDObject = this;
				// trigger AJAX
				container.fadeOut();
				var threejsColor = "0x" + hexColor;
				mesh.material.emissive.setHex( threejsColor );

				function testZeros( array ) {
					for( var i = 0; i < array.length; i ++ ) {
						if ( array[ i ] !== 0 )
							return 0;
					}
					return 1;
				}
				var state = testZeros( ledState );

				if ( state ) {
					// LED OFF
					mesh.material.color.setHex( 0xFFFFFF );
					mesh.material.emissive.setHex( 0x000000 );
				} else {
					mesh.material.color.setHex( threejsColor );
				}

				// console.log("this", this, "svg", svgContainer );
				$.ajax({
					method: "POST",
					url: "ledcontrol.php",
					data: { color: ledState, state: state },
				})
				.done(function( response ) {
					console.log( "response", response );
					LEDObject.processResponse( response );
				})
				.fail( function( error ) {
					console.error( error );
				})

			}.bind( scope );

			return lineSegment;

		}

	}

	ColorWheel.prototype.updatePosition = function( camera, position ) {

		var screenVector = new THREE.Vector3( 0, 0, 0 );
		screenVector.copy( position );
		screenVector.project( camera );

		var posx = Math.round(( screenVector.x + 1 ) * renderer.domElement.offsetWidth / 2 );
		var posy = Math.round(( 1 - screenVector.y ) * renderer.domElement.offsetHeight / 2 );

		// svgContainer.style.background = "#00ffaa";
		var width = this.svgContainer.style.width.replace("px", "");
		var height = this.svgContainer.style.height.replace("px", "");

		this.svgContainer.style.top = posy - height / 2 + "px";
		this.svgContainer.style.left = posx - width / 2 + "px";

	};

	return ColorWheel;

	// M cx, cy // Move to center of ring
	// m 0, -outerRadius // Move to top of ring
	// a outerRadius, outerRadius, 0, 1, 0, 1, 0 // Draw outer arc, but don't close it
	// m -1 outerRadius-innerRadius // Move to top point of inner radius
	// a innerRadius, innerRadius, 0, 1, 1, -1, 0 // Draw inner arc, but don't close it
	// Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke

	// Options:
	// - centerX, centerY: coordinates for the center of the circle    
	// - startDegrees, endDegrees: fill between these angles, clockwise
	// - innerRadius, outerRadius: distance from the center
	// - thickness: distance between innerRadius and outerRadius
	//   You should only specify two out of three of the radii and thickness
	function annularSector(path,options){
	  var opts = optionsWithDefaults(options);
	  var p = [ // points
	    [opts.cx + opts.r2*Math.cos(opts.startRadians),
	     opts.cy + opts.r2*Math.sin(opts.startRadians)],
	    [opts.cx + opts.r2*Math.cos(opts.closeRadians),
	     opts.cy + opts.r2*Math.sin(opts.closeRadians)],
	    [opts.cx + opts.r1*Math.cos(opts.closeRadians),
	     opts.cy + opts.r1*Math.sin(opts.closeRadians)],
	    [opts.cx + opts.r1*Math.cos(opts.startRadians),
	     opts.cy + opts.r1*Math.sin(opts.startRadians)],
	  ];

	  var angleDiff = opts.closeRadians - opts.startRadians;
	  var largeArc = (angleDiff % (Math.PI*2)) > Math.PI ? 1 : 0;
	  var cmds = [];
	  cmds.push("M"+p[0].join());                                // Move to P0
	  cmds.push("A"+[opts.r2,opts.r2,0,largeArc,1,p[1]].join()); // Arc to  P1
	  cmds.push("L"+p[2].join());                                // Line to P2
	  cmds.push("A"+[opts.r1,opts.r1,0,largeArc,0,p[3]].join()); // Arc to  P3
	  cmds.push("z");                                // Close path (Line to P0)
	  path.setAttribute('d',cmds.join(' '));

	  function optionsWithDefaults(o){
	    // Create a new object so that we don't mutate the original
	    var o2 = {
	      cx           : o.centerX || 0,
	      cy           : o.centerY || 0,
	      startRadians : (o.startDegrees || 0) * Math.PI/180,
	      closeRadians : (o.endDegrees   || 0) * Math.PI/180,
	    };

	    var t = o.thickness!==undefined ? o.thickness : 100;
	    if (o.innerRadius!==undefined)      o2.r1 = o.innerRadius;
	    else if (o.outerRadius!==undefined) o2.r1 = o.outerRadius - t;
	    else                                o2.r1 = 200           - t;
	    if (o.outerRadius!==undefined)      o2.r2 = o.outerRadius;
	    else                                o2.r2 = o2.r1         + t;

	    if (o2.r1<0) o2.r1 = 0;
	    if (o2.r2<0) o2.r2 = 0;

	    return o2;
	  }
	}

	// COLORS

	function convert( array ) {
		
	  var hex = "";
		for ( var i = 0; i < array.length; i ++ ) {
	  	if ( array[ i ] === 1 ) {
	    	hex += "FF";
	    }	else {
	    	hex += "00";
	    }
	  }

		return hex;
	}


	function colorManipulation( hexColor, saturation ) {
	  var col = hexToRgb( hexColor );  
	  var sat = saturation;
	  var gray = col.r * 0.3086 + col.g * 0.6094 + col.b * 0.0820;
	  col.r = Math.round(col.r * sat + gray * (1-sat));
	  col.g = Math.round(col.g * sat + gray * (1-sat));
	  col.b = Math.round(col.b * sat + gray * (1-sat));

	  var out = rgbToHex(col.r,col.g,col.b);
	  
		return out;
	}

	function componentToHex(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
	    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}

	function hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

} );