
const getGithubAuthToken = ()=>{
	return '6b4f61cc6dcbf0a2948a43897ea95252d937319c'
}

const getGithubConfig = query => {
	const authToken = getGithubAuthToken()
	return {
		url: 'https://api.github.com/graphql',
		method: 'post',
		headers: { 'Authorization': `bearer ${authToken}` },
		data: {
			query: query
		}
	}
}

const getApiRestConfig = ()=>{
	const authToken = getGithubAuthToken()
	return{
      url: `https://api.github.com/repos/facebook/react/contributors`,
      method: 'get',
      headers: {
        'Authorization': `token ${authToken}`
      }
    }
}

const utils = {
	getGithubConfig,
	getApiRestConfig
}

export default utils