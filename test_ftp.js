var http =  require('http');
var jenjobs = require('jenjobs');
var Client = require('ftp');

var sql = require('mssql');
var config = {
	user: 'sa',
	password: 'delljen',
	server: '192.168.3.3',
	database: 'jenjobs',
}

var c = new Client(),
fileServer = {
	host: '192.168.3.70',
	user: 'jenjobs2',
	password: 'jjftp888'
},
webServer = {
	host: '192.168.1.230',
	user: 'jenjobs',
	password: 'jjweb888'
};

var x = c.connect(fileServer);

c.on('ready', function(){
	sql.connect(config, function(err) {
		var js = new jenjobs.jobseeker();
		js.find(null, {hasResume: true});
		js.on('find_error', function(err){
			console.log('error');
			console.log(err);
		}).on('find_success', function(rows){
			rows.forEach(function(e,i){
				// console.log(i);
				console.log(e.name);
				// uploadEachFileToFtp( c, e.id, e.resume_file );
				
				var request = new sql.Request();
				request.query('SELECT JsID, JsUserName, JsResumeFile FROM tblJsProfile WHERE JsUserName=\''+e.username+'\'', function(err, recordset){
					// console.dir(recordset);
					if( err ){
						console.log('error');
						console.log(err);
					}else{
						http.get('http://files.jenjobs.com/files/resume/'+recordset[0].JsID+'/'+e.resume_file, function (body){
							c.put( body, 'jobseeker/resume/'+e.id+'/'+e.resume_file, function(err){
								console.log( 'jobseeker/resume/'+e.id+'/'+e.resume_file );
								console.log(err);
							});
						});
						
					}			
				});
				
			});
		});
	});
	
	
}).on('greeting', function(msg){
	// console.log('greeting. Msg: ');
	// console.log(msg);
}).on('error', function(err){
	console.log('error. Msg: ');
	console.log(err);
}).on('end', function(){
	console.log('end');
}).on('close', function(hasError){
	console.log('closed. Has Error: '+hasError);
});


function transferAllFile( rows ){
	
}

function transferFile(){
	
}