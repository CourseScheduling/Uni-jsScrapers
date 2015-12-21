var DB	= require('../../db.js');
var Parser  = {
  pushData:function(data,times){
		DB.query('SELECT id FROM ufv.course WHERE code=?',data.code,function(e,r){// Check if course exists already
			if(e) throw e;
			if(r.length==0){
				//if exists, throw data in a new section.
				
			}
			if(r.length==1){
				//if doesn't exist create new course
				
			}
		}
  }
}





module.exports  = Parser;