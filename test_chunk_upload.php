<?php
	session_start();
	$data = $_POST;
	
	if( empty( $_SESSION['tempFile'] ) ){
		$tmpfname = tempnam( "/tmp", 1000 );
		$_SESSION['tempFile'] = $tmpfname;
	}else{
		$tmpfname = $_SESSION['tempFile'];
	}
	
	$handle = fopen( $tmpfname, "a+" );
	if( false !== $handle ){
		fwrite( $handle, $data['filechunk'] );
		
		if( $data['lastchunk'] ){
			$fileContent = file_get_contents($tmpfname, "r");
			$uploadData = base64_decode( $fileContent );
			
			$handle2 = fopen( date( "Y-m-d" ).".$data[extension]", "w+" );
			$bytesWritten = fwrite( $handle2, $uploadData );
			fclose( $handle2 );
			
			echo $bytesWritten;
			unlink( $tmpfname );
			unset( $_SESSION['tempFile'] );
		}
	}
	fclose( $handle );
?>