var http = require('http');
http.get('http://echo.jsontest.com/key/value/one/two', function(res){
	console.log('response');
	res.on('data', function(chunk){
		console.log(chunk.toString());
		//console.log( JSON.parse( chunk.toString() ) );
	}).on('end', function(){
		//console.log('end');
	});
}).on('error', function(err){
	console.log('error');
	console.log(err.message);
});