(function($) {

	const md = window.markdownit();
	const params = new URL(window.location.href).searchParams;
	var	$window = $(window),
		$body = $('body'),
		$textAuthor = $('#text-author'),
		$textName = $('#text-name'),
		$syncBtn = $('.sync-button > button'),
		$mirrorCategory = $('#mirror-category'),
		$downloadTable = $('.download-list > tbody');

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});
	async function sync() {
		let author = $textAuthor.val()
		let name = $textName.val()
		if (author.length == 0) {
			window.alert('请输入插件作者');
			return;
		}
		if (name.length == 0) {
			window.alert('请输入插件名');
			return;
		}

		$syncBtn.prop('disabled', true)
		$downloadTable.html('<tr><td>正在获取</td></tr>');

		let repo = author + '/' + name
		let mirrorLink = $mirrorCategory.val()
		function mirror(url) {
			return mirrorLink
				.replace('{0}', url)
				.replace('{1}', url.replace('https://', ''))
		}

		await fetch("https://api.github.com/repos/" + repo + "/releases", {cache: "no-store"})
		.then(resp => {
			if (resp.status == 200) {
				return resp.json()
			}
			return {
				status: resp.status.toString()
			}
		}).then(json => {
			$downloadTable.html('');
			// console.log(json);
			if (json.status != undefined) {
				let reason = json.status;
				if (reason == '404') {
					reason = '找不到仓库';
				}
				if (reason.startsWith('5')) {
					reason = '服务器内部错误' + reason;
				}
				window.alert('错误: ' + reason);
				return;
			}
			$downloadTable.append(
				'<tr><td colspan="2"><ul class="inline-ul">' +
				  '<li><a target="_blank" href="https://github.com/' + author + '/' + name + '">Github</a></li>' +
				  '<li><a target="_blank" href="https://github.com/' + author + '/' + name + '/releases">Releases</a></li>' +
				  '<li><a target="_blank" href="https://github.com/' + author + '/' + name + '/actions">开发版本下载</a></li>' +
				'</ul></td></tr>');
			for (let i = 0; i < json.length; i++) {
				let obj = json[i];
				if (obj.assets.length > 0) {
					let versionName = obj.name;
					let bodyMarkdown = obj.body;
					let bodyRendered = '<div class="markdown-body">' + md.render(bodyMarkdown) + '</div>';
					let download = '';
					if (obj.assets.length == 1) {
						let asset = obj.assets[0];
						let url = mirror(asset.browser_download_url);
						download = '<td class="download"><a title="' + asset.name + '" href="' + url + '" data-original-download-url="' + asset.browser_download_url + '" target="_blank" class="icon solid fa-download"></a></td>';
					} else {
						let assets = [];
						for (let j = 0; j < obj.assets.length; j++) {
							let asset = obj.assets[j];
							let url = mirror(asset.browser_download_url);
							assets.push('<li><a title="' + asset.name + '" href="' + url + '" data-original-download-url="' + asset.browser_download_url + '" target="_blank" class="icon solid fa-download"> ' + asset.name + '</a></li>');
						}
						download = '<td><ul class="inline">' + assets.join('') + '</ul></td>'
					}
					$downloadTable.append('<tr><td class="download-description"><code class="version">' + versionName + '</code>' + bodyRendered + '</td>' + download + '</tr>');
				}
			}
		}).catch(e => {
			window.alert("无法访问 api.github.com - " + e + "\n请检查网络连接是否正常，以及当前网络是否遭受 DNS 污染。")
			$downloadTable.html('<tr><td>未获取</td></tr>')
			console.error(e)
		});

		$syncBtn.prop('disabled', false)
	}
	$syncBtn.click(sync);
	$mirrorCategory.change(function() {
		let mirrorLink = $mirrorCategory.val()
		function mirror(url) {
			return mirrorLink
				.replace('{0}', url)
				.replace('{1}', url.replace('https://', ''))
		}
		$('a[data-original-download-url]').each(function(i,e) {
			let link = $(e);
			let url = link.data('original-download-url');
			link.prop('href', mirror(url));
		});
	});

	if (params.has('url')) {
		let url = new URL(params.get('url'));
		if (url.host.endsWith('.github.com') || url.host.endsWith('.githubusercontent.com')) {
			let pair = url.pathname.substring(1).split('/');
			if (pair.length >= 2) {
				$textAuthor.val(pair[0]);
				$textName.val(pair[1]);
				sync();
				history.pushState({page:1}, '', window.location.pathname);
			}
		}
	} else {
		let resetPathName = false;
		if (params.has('author')) {
			resetPathName = true;
			$textAuthor.val(params.get('author'));
		}
		if (params.has('repo')) {
			resetPathName = true;
			$textName.val(params.get('repo'));
			sync();
		}
		if (resetPathName) {
			history.pushState({page:1}, '', window.location.pathname);
		}
	}
})(jQuery);
