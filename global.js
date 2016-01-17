//Just some ajax wrappers
/* To Use:
/      $.AJAX_PROTOCOL({
            url:'YOUR_URL',
            done:function(data){
                if(callback){
                    manipulate(data);
                }
            },
            data:{this:is,optional:0}
        });
*/
var request =   require('request');
_   =   {
    get:function(e){
				//Get rid of the self signed error 
				process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        request({
					url:e.url,
					headers: {
						'User-Agent': 'Schedular.io'
					}
				}, function(error, response, body) {
          if (response==undefined || error || response.statusCode !== 200) {
							console.log('Problem in the UFV scraper');
							console.log('DEBUG URL: '+e.url);
							console.log('DEBUG ERROR: '+error);
							setTimeout(function(){
								_.get(e);
							},10000)
              return;
          }
          if(e.json){
            e.done(JSON.parse(body));
          }else{
            e.done(body);
          }
        })
    },
    post:function(e){
        var tempData    =   '';
				if(e.raw==undefined){
					for(var index in e.data){
							tempData+=[index,'=',e.data[index],'&'].join('')
					}
					tempData=tempData.slice(0,-1);
					e.data  =   tempData;
				}
        
				process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        request({
					url:e.url,
					headers: {
						'User-Agent': 'Schedular.io'
					},
					body:e.data,
				}, function(error, response, body) {
          if (response==undefined || error || response.statusCode !== 200) {
					}
					e.done(body);
					
				});
    }
}
module.exports  =   _;