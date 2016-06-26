/**
 * Core application handling
 * Initialize Viewer
 */
define([
    "three",
    "scene",
    "camera",
    "renderer",
    "controls",
    "stats",
    "LED",
    "particles"
], function ( 
             THREE,
             scene, 
             camera, 
             renderer, 
             controls, 
             stats, 
             LED,
             particles
             ) {
	
	'use strict';

	// Start program
    var initialize = function () {

		// INITIAL CAMERA POSITION AND TARGET
		camera.position.set( 0, 0.3, -3.5 );
		controls.target.copy( new THREE.Vector3( 0, 0.1, 0 ) );

		var textureLoader = new THREE.TextureLoader();
		var path = "assets/textures/images/pattern_222/";
		var T_wood_d = textureLoader.load( path + "diffuse.jpg" );
		var T_wood_n = textureLoader.load( path + "normal.jpg" );
		var T_wood_s = textureLoader.load( path + "specular.jpg" );

		T_wood_d.anisotropy = 16;
		T_wood_n.anisotropy = 16;

		var x = 2, y = 2;
		myRepeat( T_wood_d, x, y );
		myRepeat( T_wood_n, x, y );

		function myRepeat( texture, x, y ) {

			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 2, 2 );

		}

		var roomMaterial =  new THREE.MeshPhysicalMaterial( { 
				map: T_wood_d, 
				normalMap: T_wood_n, 
				normalScale: new THREE.Vector2( -1, -1 ),
				side: THREE.BackSide, 
				metalness : 1, 
				roughness: 0.8,
			} );

		var roomGeometry = new THREE.BoxGeometry( 5, 2.6, 5 );
		var room = new THREE.Mesh( roomGeometry, roomMaterial );
		room.position.set( 0, 0.7, 0 );
		// room.rotation.y = 90 * Math.PI / 180;
		scene.add( room );

		var littleCube = new THREE.Mesh( new THREE.BoxGeometry( 0.3, 0.3, 0.3 ), new THREE.MeshPhysicalMaterial({ color: 0xFFFFFF, roughness: 1 } ) );
		scene.add( littleCube );
		littleCube.position.set( 0.2, -0.45, 1 );
		littleCube.rotation.y = 30 * Math.PI / 180;

		var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
		directionalLight.position.set( 0, 1, -2 );
		scene.add( directionalLight );
		
		var LED1 = new LED( 0xFF0000 );
		LED1.setPosition( 1, 0, 0 );
		
		var LED2 = new LED( 0xFFFF00 );
		LED2.setPosition( 0, 0, 0 );

		var LED3 = new LED( 0x00FF00 );
		LED3.setPosition( -1, 0, 0 );


		// set Reset Values
		controls.target0 = controls.target.clone();
		controls.position0 = camera.position.clone();
		controls.zoom0 = camera.zoom;

	};

	// MAIN LOOP
    var animate = function () {

		controls.update();
		stats.update();

		particles.tick();

		renderer.render( scene, camera );

		requestAnimationFrame( animate );

    };

    return {
        initialize: initialize,
        animate: animate
    }
});