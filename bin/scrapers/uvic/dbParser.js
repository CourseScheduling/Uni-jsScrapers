var mongoose	=	require('mongoose');
mongoose.connect('mongodb://localhost:27017/schedular',{},function(){
	console.log('Connected To Mongo');
});

var courseSchema = new mongoose.Schema({
  id:String,
  code:String,
  name:String,
  description:String,
  department:String,
  prerequisites:String,
  exclusions:String,
  level:Number,
  term:String,
  sections:{type:Array,default:[]}
});



var Course	=	mongoose.model('Course',courseSchema,'course');

var Parser  = {
  pushData:function(line){
		console.log('pushing Line');
  }
}





module.exports  = Parser;