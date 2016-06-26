/**
 * Snow Particles
 */

define([ "three","ShaderParticleEngine", "scene" ], function ( THREE, SPE, scene ) {

    'use strict';

    // Create particle group and emitter

    var loader = new THREE.TextureLoader();
    // var texture = loader.load('assets/textures/img/smokeparticle.png');
    // var texture = loader.load('assets/textures/img/snowflake4.png');
    // var texture = loader.load('assets/textures/img/snowflake5.png');
    var texture = loader.load('assets/textures/img/star.png');

	var particleGroup = new SPE.Group({
		texture: {
            value: texture
        },
        maxParticleCount: 750,
        // direction: -1
	});

    particleGroup.setDirection = function( direction ) {
        for ( var i = 0; i < this.emitters.length; i ++ ) {
            // this.emitters[ i ].velocity.value = new THREE.Vector3( normal.x * v, normal.y * v, normal.z * v );
            this.emitters[ i ].direction = direction;
        }
    };

    particleGroup.setColor = function( colorStart, colorEnd ) {
        // set the hit object normal as velocity
        // for every emitter (ideally not the active one, but whatevs)
        // this is setting velocity for all emitters in the pool
        // this.emitters[0].velocity.set( x * v, y * v, z * v );
        // console.log( this.emitters[0] );

        for ( var i = 0; i < this.emitters.length; i ++ ) {
            // this.emitters[ i ].velocity.value = new THREE.Vector3( normal.x * v, normal.y * v, normal.z * v );
            this.emitters[ i ].color.value = [ new THREE.Color( colorStart ), new THREE.Color( colorEnd) ];
            // particleGroup.emitters[ i ].size.value = [ 0.3, 0.3, 0.1 ];
            // particleGroup.emitters[ i ].position.value = new THREE.Vector3( 0, 0.5, 0 );
            // particleGroup.emitters[ i ].position.spread = new THREE.Vector3( 0.2, 0.2, 0.1 );
            // particleGroup.emitters[ i ].acceleration.value = new THREE.Vector3( 10, 10, 2 );
        }

    };

    var emitter = new SPE.Emitter({
        type: 2,
        // activeMultiplier: 1,
        // direction: -1,
        duration: 0.2,
        maxAge: {
            value: 0.6
            // value: 2.8
        },
        position: {
            // value: new THREE.Vector3( 0, 0, 0 ),
            radius: 0.2, // attributes..emitters[0].position._radius
            spread: new THREE.Vector3( 0.1, 0.1, 0.1 )
            // spread: new THREE.Vector3( 0.8, 0.8, 0.8 ),
            // clamp: 0.2,
            // randomise: true
        },

        velocity: {
            value: new THREE.Vector3( 0.5, 1, 1 ),
            // distribution: SPE.distributions.DISC
            distribution: SPE.distributions.SPHERE
        },

        acceleration: {
            // value: new THREE.Vector3( 0.1, 0.1, 0.1 ),
            // distribution: SPE.distributions.SPHERE
        },

        drag: {
            value: 1
        },

        color: {
            // value: [ new THREE.Color('green'), new THREE.Color('black') ]
            value: [ new THREE.Color( 0xd2ff00 ), new THREE.Color( 0xffc200) ],
            spread: new THREE.Vector3( 1, 1, 1 )
        },

        opacity: {
            value: [ 0, 0.2, 0.4, 0.0 ]
            // value: [ 0, 1 ]
        },

        size: {
            value: 0.05,
            spread: [ 0.1, 0.2, 0.1 ]
        },

        particleCount: 250
    });

// random durcheinander
/*
    var emitter = new SPE.Emitter({
        type: 2,
        // activeMultiplier: 1,
        // direction: -1,
        // duration: 0.3,
        maxAge: {
            value: 0.3
        },
        position: {
            // value: new THREE.Vector3( 0, 0, 0 ),
            radius: 0.0, // attributes..emitters[0].position._radius
            // spread: 1 === 1 ? new THREE.Vector3( 0.3, 0.3, 0.3 ) : undefined
            // spread: new THREE.Vector3( 0.01, 0.01, 0.01 )
            spread: new THREE.Vector3( 0.4, 0.4, 0.4 ),
            // clamp: 0.2,
            randomise: true
        },

        velocity: {
            value: new THREE.Vector3( -0.5, -0.5, -0.5 ),
            // distribution: SPE.distributions.DISC
            // distribution: SPE.distributions.SPHERE
        },

        acceleration: {
            value: new THREE.Vector3( 0.3, 0.3, 0.3 ),
            distribution: SPE.distributions.SPHERE
        },

        drag: {
            value: 0.5
        },

        color: {
            // value: [ new THREE.Color('green'), new THREE.Color('black') ]
            value: [ new THREE.Color( 0xd2ff00 ), new THREE.Color( 0xd2ff00) ]
        },

        opacity: {
            value: [ 0, 0.3, 0.5, 0.1 ]
        },

        size: {
            value: 0.05,
            spread: [ 0.1, 0.2, 0.1 ]
        },

        particleCount: 250
    });
*/
    // particleGroup.addEmitter( emitter );
    particleGroup.addPool( 3, emitter, true)

    scene.add( particleGroup.mesh );
    // x = particleGroup;
    return particleGroup;
        
});

 // var x;