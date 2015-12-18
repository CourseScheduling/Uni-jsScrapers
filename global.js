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
        request(e.url, function(error, response, body) {
          if(e.json){
            e.done(JSON.parse(body));
          }else{
            e.done(body);
          }
        })
    },
    post:function(e){
        var tempData    =   '';
        for(var index in e.data){
            tempData+=[index,'=',e.data[index],'&'].join('')
        }
        tempData=tempData.slice(0,-1);
        e.data  =   tempData;
        
        var request = new XMLHttpRequest();
        request.open('POST',e.url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
              e.done&&e.done(JSON.parse(request.responseText));
          }
        };
        request.onerror = function() {};
        request.send(e.data);
    }
}
module.exports  =   _;