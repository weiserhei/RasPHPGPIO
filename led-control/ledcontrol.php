<?php

	if ( isset( $_POST ) ) {

		header('Content-Type: application/json');

		// flip state 1 -> 0
		$_POST["state"] = $_POST["state"] ^ 1;

		$color = $_POST["color"];
		$state = $_POST["state"];
		
		$red = 4;
		$yellow = 17;
		$green = 27;

		$RGB = [16, 20, 21];

		// Match pin to color
		//-------------------
		// convert decimal color to hex-string
		if ( is_array( $color ) ) {

			foreach ( $color as $key => $on_off ) {

				setMode( $RGB[ $key ], "out" );
				setWrite( $RGB[ $key ], $on_off );

			}

		} else {

			$clicked = null;
			$hexColor = dechex( $color );
			switch( $hexColor ) {

				case "ff0000":
					$clicked = $red;
					break;
				case "ffff00":
					$clicked = $yellow;
					break;
				case "ff00":
					$clicked = $green;
					break;

			}

			setMode( $clicked, "out" );
			setWrite( $clicked, $state );

		}


		echo json_encode( $_POST );

	}
	
	function setWrite( $id, $state ) {

		return shell_exec("/usr/local/bin/gpio -g write ".$id." ".$state);

	}

	function setMode( $id, $in_out ) {

		return shell_exec("/usr/local/bin/gpio -g mode ".$id." ".$in_out);

	}



?>