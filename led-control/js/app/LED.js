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
       "particles"
], function ( THREE, scene, DomEvents, camera, renderer, particles ) {

	var domEvents = new THREEx.DomEvents(camera, renderer.domElement)

	function LED( color ) {

		this.intensity = 1.0;
		// var intensity = 0;
		var distance = 2;
		var decay = 1;

		var self = this;
		// 1 = ON
		this.state = 1;

		this.color = color;

		this.light = new THREE.PointLight( color, this.intensity, distance, decay );
		scene.add( this.light );
		
		var sphereMaterial = new THREE.MeshStandardMaterial( { transparent: true, opacity: 0.8, emissive: this.light.color, color: this.light.color, wireframe: false } );
		this.sphere = new THREE.Mesh( new THREE.SphereGeometry( 0.2, 32, 16 ), sphereMaterial );
		scene.add( this.sphere );
		this.sphere.position.copy( this.light.position );


		// Behavior
		//---------
		domEvents.addEventListener(this.sphere, 'click', function(event){

			$.ajax({
				method: "POST",
				url: "ledcontrol.php",
				data: { color: color, state: self.state },
			})
			.done(function( response ) {
				// console.log( "response", response );
				self.processResponse( response );
			})
			.fail( function( error ) {
				console.error( error );
			})

		}, false);

	}

	LED.prototype.processResponse = function( response ) {

		this.state = response.state;
		
		var intensity = this.state ? this.intensity : 0;
		this.light.intensity = intensity;

		if ( intensity === 0 ) {
			particles.setDirection( -1 );
			this.sphere.material.emissive.setHex( 0x000000 );
			// this.sphere.material.shininess = 0;
			// this.sphere.material.color.setHex( 0x000000 );

		} else {
			particles.setDirection( 1 );
			// this.sphere.material.color.setHex( this.color );
			this.sphere.material.emissive.setHex( response.color );
		}
		particles.setColor( this.color, this.color );
		// particles.setColor( this.color, 0xAAFF00 );
		particles.mesh.position.copy( this.sphere.position );
		particles.triggerPoolEmitter( 1 );

	}

	LED.prototype.setPosition = function( x, y, z ) {

		this.light.position.set( x, y, z );
		this.sphere.position.copy( this.light.position );

	}

	return LED;

} );