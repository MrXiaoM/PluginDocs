(function($) {

	const md = window.markdownit();
	const params = new URL(window.location.href).searchParams;
	var	$window = $(window),
		$body = $('body'),
		$textAuthor = $('#text-author'),
		$textName = $('#text-name'),
		$textWorkflow = $('#text-workflow'),
		$syncBtn = $('.sync-button > button'),
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
		let workflowFile = $textWorkflow.val()
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
		let requestURL = workflowFile.length == 0
			? ("https://api.github.com/repos/" + repo + "/actions/runs")
			: ("https://api.github.com/repos/" + repo + "/actions/workflows/" + workflowFile + "/runs");
		await fetch(requestURL, {cache: "no-store"})
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
				'</ul></td></tr>');
			let workflowRuns = json.workflow_runs;
			for (let i = 0; i < workflowRuns.length; i++) {
				let obj = workflowRuns[i];
				if (obj.status != 'completed') continue;
				let name = obj.name;
				let runNumber = obj.run_number;
				let headBranch = obj.head_branch;
				let headSha = obj.head_sha;
				let title = obj.display_title;
				let runStartTime = new Date(obj.run_started_at);
				let id = obj.id;
				let branchURL = 'https://github.com/' + repo + '/tree/' + headBranch;
				let commitURL = 'https://github.com/' + repo + "/commits/" + headSha;
				let githubRunsURL = 'https://github.com/' + repo + '/actions/runs/' + id;
				let nightlyRunsURL = 'https://nightly.link/' + repo + '/actions/runs/' + id;
				const year = runStartTime.getFullYear().toString().padStart(4, "0");
				const month = (runStartTime.getMonth() + 1).toString().padStart(2, "0");
				const day = runStartTime.getDate().toString().padStart(2, "0");
				const hour = runStartTime.getHours().toString().padStart(2, "0");
				const minute = runStartTime.getMinutes().toString().padStart(2, "0");
				const second = runStartTime.getSeconds().toString().padStart(2, "0");
				function pad(num) {
  					return num.toString().padStart(2, "0");
				}
				let runStartTimeFormatted = `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
				let triggeredBy = headSha.length > 7
					? `提交 <a href="${commitURL}" target="_blank">${headSha.substring(0, 7)}</a>`
					: '用户触发';
				$downloadTable.append(`<tr>
                	<td>
				  		<span class="branch-tag"><a href="${branchURL}" target="_blank">${headBranch}</a></span> <b><a href="${githubRunsURL}" target="_blank">${title}</a></b><br>
						<span>${name} <a href="${githubRunsURL}" target="_blank">#${runNumber}</a>: ${triggeredBy}</span>
					</td>
                  	<td class="download">
						<span>${runStartTimeFormatted}</span><br>
						<a href="${nightlyRunsURL}" target="_blank" class="icon solid fa-download"> 获取文件</a>
					</td>
                </tr>`);
			}
		}).catch(e => {
			window.alert("无法访问 api.github.com - " + e + "\n请检查网络连接是否正常，以及当前网络是否遭受 DNS 污染。")
			$downloadTable.html('<tr><td>未获取</td></tr>')
			console.error(e)
		});

		$syncBtn.prop('disabled', false)
	}
	$syncBtn.click(sync);

	if (params.has('url')) {
		let url = new URL(params.get('url'));
		if (url.host.endsWith('.github.com') || url.host.endsWith('.githubusercontent.com')) {
			let pair = url.pathname.substring(1).split('/');
			if (pair.length >= 2) {
				$textAuthor.val(pair[0]);
				$textName.val(pair[1]);
				if (pair.length >= 5 && pair[2] == 'actions' && pair[3] == 'workflows') {
					$textWorkflow.val(pair[4]);
				}
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
		if (params.has('workflow')) {
			resetPathName = true;
			$textWorkflow.val(params.get('workflow'));
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
