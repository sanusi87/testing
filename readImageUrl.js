var http = require('http');
var fs = require('fs');

var counter = process.argv[2];
if( counter ){
    counter = counter.replace( /^c=/g, '' );
}

/*
=== 1 file download ===
var fileStr = 'http://v1.maxis.com.my/mbb3/image/T3_meter.gif';
var extension = /\.([a-z0-9]+?)$/ig.exec(fileStr),
newFileName = (new Date()).getTime()+'.'+extension[1];

http.get(fileStr, function(response){
    response.on('data', function(chunk){
        fs.appendFile(newFileName, chunk, function(err){
            console.log(err);
        });
    });
});
*/

/*
=== multiple+sequencial file download
*/
var start = counter || 48;
var end = counter ? counter : 80;
var stringPad = 2;
var chapter = '440';
//var fileStr = 'http://i996.mangareader.net/one-piece/781/one-piece-55678*.jpg';

//var fileStr = 'http://a.mangatown.com/store/manga/13613/'+chapter+'.0/compressed/i0*.jpg'; //17
//var fileStr = 'https://r2---sn-30a7dne7.googlevideo.com/videoplayback?id=820b4e63175f6e11&itag=18&source=picasa&requiressl=yes&mm=30&mn=sn-30a7dne7&ms=nxu&mv=m&pl=22&gir=yes&clen=90217210&dur=1435&lmt=1434247951290952&mime=video/mp4&mt=1434249153&ip=113.210.138.162&ipbits=0&expire=1434277986&sparams=ip,ipbits,expire,id,itag,source,requiressl,mm,mn,ms,mv,pl,gir,clen,dur,lmt,mime&signature=6A4751D641B1803F59D7AB03A36CA96A6416F615.68E8C2AF71666D97306E85431EC6645ADF34D05A&key=ck2';

// var fileStr = 'http://a.mangatown.com/store/manga/13613/'+chapter+'.0/compressed/h0*.jpg'; //18
// var fileStr = 'http://a.mangatown.com/store/manga/13613/'+chapter+'.0/compressed/o0*.jpg'; //19
// var fileStr = 'http://a.mangatown.com/store/manga/13613/'+chapter+'.0/compressed/q0*.jpg'; //20
// var fileStr = 'http://a.mangatown.com/store/manga/13613/021.0/compressed/j001.jpg'; //21
//http://a.mangatown.com/store/manga/13613/022.0/compressed/bimg001.jpg?v=51424746622
//http://a.mangatown.com/store/manga/13613/023.0/compressed/l001.jpg?v=51425051421
//http://a.mangatown.com/store/manga/13613/024.0/compressed/l001.jpg?v=51425055029
//http://a.mangatown.com/store/manga/13613/025.0/compressed/c001.jpg?v=51425058621
//http://a.mangatown.com/store/manga/13613/026.0/compressed/j001.jpg?v=51425058742
//http://a.mangatown.com/store/manga/13613/027.0/compressed/r001.jpg?v=51425060442
//http://a.mangatown.com/store/manga/13613/028.0/compressed/c001.jpg?v=51425064021
//http://a.mangatown.com/store/manga/13613/029.0/compressed/o001.jpg?v=51430113441
//http://a.mangatown.com/store/manga/13613/030.0/compressed/j001.jpg?v=51430113490
//http://a.mangatown.com/store/manga/13613/031.0/compressed/s001.jpg?v=51430113502
//http://a.mangatown.com/store/manga/13613/032.0/compressed/f001.jpg?v=51428980589
//http://a.mangatown.com/store/manga/13613/033.0/compressed/mimg001.jpg?v=51429783682
//http://a.mangatown.com/store/manga/13613/034.0/compressed/r001.jpg?v=51430508121


//var fileStr = 'http://a.mangatown.com/store/manga/13613/007.0/compressed/kdungeon007_0*.jpg';
//var fileStr = 'http://i997.mangareader.net/naruto-gaiden-the-seventh-hokage/7/naruto-gaiden-the-seventh-hokage-57362*.jpg';
//var fileStr = 'http://i996.mangareader.net/bleach/630/bleach-5736326.jpg';
//var fileStr = 'http://i8.mangareader.net/one-piece/787/one-piece-56890*.jpg';
var fileStr = 'http://i997.mangareader.net/fairy-tail/440/fairy-tail-57425*.jpg';


downloadFiles();

function downloadFiles(){
    fs.mkdir(chapter, function(err){
        if( start <= end ){

            var temp = start.toString();
            if( temp.length < stringPad ){
                while( temp.length < stringPad ) temp = "0" + temp;
            }
            var newFileUrl = fileStr.replace(/\*/g, temp);
            //console.log( newFileUrl );
            //var extension = /\.([a-z0-9]+?)$/ig.exec(newFileUrl),
            //newFileName = (new Date()).getTime()+'.'+extension[1];
            var fileUrlPart = newFileUrl.split(/\//g),
            newFileName = fileUrlPart[fileUrlPart.length-1];
            downloadFile(newFileUrl, newFileName);
        }
    });
}

function downloadFile( theFileUrl, theFileName ){
    console.log('downloading '+theFileName+'...');
    http.get(theFileUrl, function(response){
        console.log(response.headers['content-length']);
        var cl = response.headers['content-length'];
        if( response.statusCode == 200 ){

            fs.exists(theFileName, function(exists){

                fs.appendFile(chapter+'.txt', '');

                //if( !counter ){
                //    start++;
                //    downloadFiles();
                //}

                if( exists ){
                    fs.truncateSync(theFileName, 0);
                }

                response.on('data', function(chunk){
                    fs.appendFile(theFileName, chunk, function(err){
                        var fc = fs.readFileSync(theFileName);

                        var fcl = fc.length;
                        fcl = fcl.toString();
                        if( fcl.length < 6 ){
                            while( fcl.length < 6 ) fcl = "0" + fcl;
                        }
                        console.log('appending '+theFileName+'...'+fcl+' of '+cl+'('+Number(Number(fcl) / Number(cl) * 100).toFixed(2)+'%)');

                        if( fcl == cl ){
                            fs.appendFile(chapter+'.txt', theFileName+'...'+fcl+' of '+cl+'\n');
                        }
                    });
                }).on('end', function(){
                    console.log('request end!');
                    start++;
                    downloadFiles();

                    fs.open(chapter+'/'+theFileName, 'w', function(err, fd){
                        console.log(err);
                        fs.readFile(theFileName, function(err, buffer){
                            console.log(err);
                            fs.write(fd, buffer, 0, buffer.length, null, function(err, writter, buff){
                                if(err){
                                    console.log(err);
                                }else{
                                    fs.unlinkSync(theFileName);
                                }
                            });
                        });
                    });
                });
            });

        }else{
            start++;
            downloadFiles();
        }
    }).on('error', function(err){
        console.log(err);
        start++;
        downloadFiles();
    });
}
