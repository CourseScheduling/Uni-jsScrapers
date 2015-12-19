
var Parser  = {
  pushData:function(data){
    var lines = data.split('\n'); //Each line contains its own JSON document.
    lines.forEach(function(line,index,array){
      var json  = JSON.parse(line); // Parse the JSON in the line
      
      
    });
  }
}





module.exports  = Parser;