window.renderPostPage = function(title, desc, author, content){
	return `<!DOCTYPE html><html>
	<head>
		<meta charset="utf-8">
		<title>${title}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<meta name="format-detection" content="telephone=no" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="MobileOptimized" content="176" />
		<meta name="HandheldFriendly" content="True" />
		<meta name="robots" content="index, follow" />
		<meta property="og:site_name" content="Telegraph - IPFS">
		<meta property="og:type" content="article">
		<meta property="og:title" content="${title}">
		<meta property="og:description" content="${desc}">
		<meta property="og:image" content="">
		<meta property="article:author" content="${author}">
		<meta name="twitter:card" content="summary">
		<meta name="twitter:title" content="${title}">
		<meta name="twitter:description" content="${desc}">
		<meta name="twitter:image" content="">

		<style type="text/css">
			.ta address a[rel=author]:empty+time:before,.ta address.empty,.ta time:empty:before{display:none}.ta .tac blockquote,.ta .tac p,.ta .tac pre,.ta_header{word-wrap:break-word}.prompt,.tl_blocks{right:0;position:absolute}body,html{padding:0;margin:0}textarea{resize:none}.tl_page_wrap{max-width:732px;margin:0 auto}.ta .tac .iframe_wrap,.ta .tac iframe,.ta .tac img,.ta .tac video{max-width:100%;vertical-align:top}.tl_page{position:relative;padding:21px 0}.tl_message{font-family:CustomSansSerif,'Lucida Grande',Arial,sans-serif;padding:70px 0;color:#79828B;text-align:center}.tl_message h1{font-size:120px;margin:0}.ta .ql-container{height:auto}.prompt{left:0;top:0;bottom:0}.prompt .prompt_input_wrap{overflow:hidden}.prompt .prompt_input{width:100%;margin:0;border:none;background-color:transparent;box-sizing:border-box}.tl_blocks{text-align:right;left:0;visibility:hidden;opacity:0;transition:opacity .15s ease}.tl_blocks.shown{visibility:visible;opacity:1}@media (max-width:960px){.tl_blocks{text-align:center}}.ta ::selection{background:#dbdbdb}.ta ::-moz-selection{background:#dbdbdb}.ta .cursor_wrapper{display:none;position:absolute;font-size:1px;left:50%;z-index:-1}.ta .ta_header,.ta .tac,.ta .tac .ql-editor{font-family:CustomSerif,Georgia,Cambria,'Times New Roman',serif;font-weight:400;font-style:normal;font-size:18px;line-height:1.58;padding:0;margin:0;color:rgba(0,0,0,.8)}.ta address,.ta h1,.ta h2{font-family:CustomSansSerif,'Lucida Grande',Arial,sans-serif;font-style:normal}.ta .ql-editor{height:100%;overflow:visible;text-align:inherit}.ta .tac,.ta .tac .ql-editor *{white-space:pre-wrap}.ta .tac.ql-container{white-space:normal}.ta h1,.ta h2{font-weight:700;font-size:32px;margin:21px 21px 12px;line-height:34px}.ta h2{font-size:24px;margin:-6px 21px 12px;color:rgba(0,0,0,.44)}.ta address,.ta address a{color:#79828B}.ta address{font-size:15px;line-height:18px;margin:12px 21px}.ta address time:before{content:'â€¢';padding:0 7px}.ta a[href]{color:inherit;-webkit-tap-highlight-color:rgba(0,0,0,.44);text-decoration:none;border-bottom:.1em solid rgba(0,0,0,.7)}.ta address a[href]{border-bottom:none}.ta .tac p{margin:0 21px 12px}.ta .tac code,.ta .tac pre{font-family:Menlo,'Courier New',Courier,monospace;font-size:16px;background:#F5F8FC}.ta .tac code{padding:1px 3px}.ta .tac pre{margin:14px 0;padding:7px 21px;white-space:pre-wrap}.ta .tac h3,.ta .tac h4{font-family:CustomSansSerif,'Lucida Grande',Arial,sans-serif;font-weight:700;font-style:normal;font-size:28px;margin:18px 21px 9px}.ta .tac aside,.ta .tac blockquote{font-family:CustomSerif,Georgia,Cambria,'Times New Roman',serif;font-style:italic}.ta .tac h4{font-size:24px;margin:18px 21px 7px}.ta .tac blockquote{margin:18px 21px 16px 0;padding-left:15px;position:relative;border-left:3px solid #000}.ta .tac aside{font-size:21px;color:rgba(0,0,0,.6);margin:18px 21px 16px;padding:0 18px;text-align:center}.ta .tac hr{width:50%;margin:30px auto;border:none;font-size:2px;text-align:right}.ta .tac hr:after{content:'';display:block;border-top:1px solid #c9cdd1;margin:0 3px;position:relative;top:1px}.ta .tac ol,.ta .tac ul{padding:0;margin:21px;list-style:none;counter-reset:list}.ta .tac ol li,.ta .tac ul li{margin-left:30px;margin-bottom:14px;padding:0;position:relative}.ta .tac ol li:before,.ta .tac ul li:before{position:absolute;display:inline-block;box-sizing:border-box;width:78px;margin:0 0 0 -78px;text-align:right}.ta .tac ul li:before{padding:1px 15px 0 0;content:'â€¢'}.ta .tac ol li:before{font-feature-settings:'liga' on,'lnum' on;-moz-font-feature-settings:'liga' on,'lnum' on;-webkit-font-feature-settings:'liga' on,'lnum' on;padding-right:12px;counter-increment:list;content:counter(list) '.'}.ta .tac .iframe_wrap{position:relative}.ta .tac .iframe_wrap iframe{position:absolute;width:100%;height:100%;top:0;left:0}.ta .tac .figure_wrapper,.ta .tac figure{position:relative}.ta .tac figure{margin:0 21px 16px;padding:0;text-align:center}.ta .tac figcaption,.ta .tac figcaption .editable_input{font-family:CustomSansSerif,'Lucida Grande',Arial,sans-serif;font-size:15px;color:#79828B;padding:12px 21px 0;line-height:18px;vertical-align:top;text-align:center}.ta .tac figcaption .editable_input{width:100%;border:none;padding:0;margin:0}.ta .tac .figure_wrapper img,.ta .tac .figure_wrapper video{opacity:1;transition:opacity .15s ease;max-width: 100%}.ta .tac .figure_wrapper.loading img,.ta .tac .figure_wrapper.loading video{opacity:.3}.ta .tac .figure_wrapper .file_progress{position:absolute;z-index:1;bottom:0;left:0;right:0;padding:3px;background-color:rgba(255,255,255,.7);transition:opacity .15s ease;visibility:hidden;opacity:0}.ta .tac .figure_wrapper.loading .file_progress{visibility:visible;opacity:1}.ta .tac .figure_wrapper .file_progress_bar{height:2px;background-color:#333;transition:width .1s linear;width:0}.ta .tac input.ql-image[type=file]{display:none}
			.tac h1, .tac address { display:none !important;}
			#share {
				position: absolute; z-index:99; top:10px; right: 10px; text-transform: uppercase;
				color: #777;  font-family: CustomSansSerif,'Lucida Grande',Arial,sans-serif;
				padding: 5px 10px 0px 10px; width: 50px; height: 25px;

				text-decoration: none;
			}
			#share:hover { opacity: 0.8; }
		</style>
		<script type="text/javascript">
			document.addEventListener('DOMContentLoaded', function(){
				var share_a = document.getElementById('share')
					share_a.href          = location.href
					share_a.style.display = 'inline-block'

				var inp = document.querySelector('#share input')
					inp.value = location.href

				share_a.addEventListener('click', function(e){
					e.preventDefault();
					if (navigator && navigator.share) {
						navigator.share({
							title : document.title,
							text  : document.head.querySelector('meta[property="og:description"]').content,
							url   : window.location.href
						})
						return
					}
					inp.select();
					document.execCommand('copy');
					alert('Url copied to clippboard');
				})
			})
		</script>
	</head>
	<body>
		<div class="tl_page_wrap">
			<a id="share" style="display: none;">Share<input type="text" style="opacity: 0;"></a>
			<div class="tl_page">
				<main class="ta">
					<header class="ta_header">
						<h1 dir="auto">${title}</h1>
						<address dir="auto">
							<a rel="author">${author}</a>
						</address>
					</header>
					
					<article class="tac">
						${content}
					</article>
				</main>
			</div>
		</div>
	</body>
</html>`;

}