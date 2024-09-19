document.addEventListener('DOMContentLoaded', function(){
	var urlarr = window.location.href.split('/')
		urlarr.pop()
		urlarr.pop()
	
	window.ipfs_gateway = urlarr.join('/')
	if (window.ipfs_gateway.length < 10) {
		window.ipfs_gateway = 'https://ipfs.io/ipfs'
	}

	window.api_host = "localhost:5001"

	if(location.hash.length >= 4){
		window.api_host = location.hash.split("#")[1]
	}
	
	window.save2IPFS = function(d, c) {
		const blob = new Blob([d], { type: 'plain/text' });
			const formData = new FormData();
			formData.append('file', blob);
			let api = '//'+window.api_host+'/api/v0/add';
			$.ajax({
				url: api,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(res) {
					if (res.Hash) {
						
						setTimeout(seeding(res),1)
						setTimeout(c(null,res.Hash),3000)
						
					} else {
						console.error('上传失败');
					}
				},
				error: function() {
					console.error('请求失败');
				}
			});

	}

	initView()
})


function initView(){
	window.pageContent = false;
	window.quill       = initQuill();

	if (browser.mobile) {
	  $(document.body).addClass('mobile');
	}

	startTelegraph()

	$('body').removeClass('loading')
}


if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js')
}