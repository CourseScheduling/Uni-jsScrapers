var request =   require('request');
var dbParser = require('./dbParser');

var API_URL    =   'https://api.github.com/repos/cobalt-uoft/datasets/git/refs/heads/master';
var lastHash    =   '';


function fetchNew(){
	var dumpLocation    =   'https://github.com/cobalt-uoft/datasets/blob/master/courses.json?raw=true';
	request({
			url:dumpLocation,
			headers: {
				'User-Agent': 'Schedular.io'
			}
		},function(error,response,body){
			console.log('got file');
      body.split('\n').forEach(function(line,i,a){
				try{
					line = JSON.parse(line);
				}catch(e){
					console.log('Not JSON',line);
					return;
				}
				dbParser.pushData(line);
			});
  });
	
}

function fetchHash(){
	request({
			url:API_URL,
			headers: {
				'User-Agent': 'Schedular.io'
			}
		},function(error,response,body){
			var body    =   JSON.parse(body);
			if(body.object.hash==lastHash)
				return;
			lastHash    =   body.object.hash;
			fetchNew();
	});
	setInterval(fetchHash,14400000);
}


// Yay, let's get this party started
fetchHash();


module.exports	=	{
	start:fetchHash,
	forceReset:fetchNew
};