const getGithubConfig = query => {
	return {
		url: 'https://api.github.com/graphql',
		method: 'post',
		headers: { 'Authorization': 'bearer 6b4f61cc6dcbf0a2948a43897ea95252d937319c' },
		data: {
			query: query
		}
	}
}

const utils = {
	getGithubConfig
}

export default utils