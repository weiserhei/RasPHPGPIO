/**
 *	Globe Class
 *	creating the earth and stuffs
 */

define([
       "three",
       "scene",
       "DomEvents",
       "camera",
       "renderer",
       "particles",
       "ColorWheel"
], function ( THREE, scene, DomEvents, camera, renderer, particles, ColorWheel ) {

	var domEvents = new THREEx.DomEvents(camera, renderer.domElement)

	function RGBLED( color ) {

		this.intensity = 1.2;
		var intensity = 0;
		var distance = 3;
		var decay = 0.8;
		var em = new THREE.Color( 0x000000 );

		var self = this;
		// 1 = ON
		this.state = 1;

		this.color = color;

		this.light = new THREE.PointLight( color, intensity, distance, decay );
		scene.add( this.light );
		
		var sphereMaterial = new THREE.MeshStandardMaterial( { transparent: true, opacity: 0.8, emissive: em, color: this.light.color, wireframe: false } );
		this.sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.25, 32, 16 ), sphereMaterial );
		scene.add( this.sphere );
		this.sphere.position.copy( this.light.position );


		var svgContainer = $("#svgcontainer");
		this.colorWheel = new ColorWheel( svgContainer, this.sphere, this );
		this.colorWheel.updatePosition( camera, this.sphere.position );
		// Behavior
		//---------
		domEvents.addEventListener(this.sphere, 'click', function(event){

			// onclick
			// > show Color wheel
			// onclick Color Wheel
			// > AJAX
			svgContainer.fadeIn();


		}, false);

	}

	RGBLED.prototype.processResponse = function( response ) {

		console.log("sphere color", this.sphere.material.color, "sphere emissive", this.sphere.material.emissive );

		var color = this.sphere.material.color;
		this.light.color = color;

		// Point light ON or OFF
		this.state = response.state;
		var intensity = this.state ? this.intensity : 0;
		this.light.intensity = intensity;

		if ( intensity === 0 ) {
			particles.setDirection( -1 );
			// this.sphere.material.color.setHex( 0xFFFFFF );
			// this.sphere.material.emissive.setHex( 0x000000 );
			// this.sphere.material.shininess = 0;
		} else {
			particles.setDirection( 1 );
		}

		particles.setColor( color, color );
		// particles.setColor( this.color, 0xAAFF00 );
		particles.mesh.position.copy( this.sphere.position );
		particles.triggerPoolEmitter( 1 );

	}

	RGBLED.prototype.setPosition = function( x, y, z ) {

		this.light.position.set( x, y, z );
		this.sphere.position.copy( this.light.position );

	};

	RGBLED.prototype.update = function( camera ) {

		this.colorWheel.updatePosition( camera, this.sphere.position );

	};

	return RGBLED;

} );