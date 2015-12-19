[].forEach.call(document.getElementsByClassName('scraperCheck'),function(check,i,a){
	check.addEventListener('click',function(a){
		if(e.target.checked)
			$.post({
				url:'/changeScraper'
			});
		
	});
});