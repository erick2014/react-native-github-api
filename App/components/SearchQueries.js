const getAllRepositoresByKeyWord = repo => {
	return `
      query {
        search(query: "is:public ${repo} in:name", type: REPOSITORY, first: 10) {
          repositoryCount
          pageInfo {
            endCursor
            startCursor
          }
          edges {
            node {
              ... on RepositoryInfo{
                name,
                description
                url
                homepageUrl
              }
            }
          }
        }
      }
    `
}

export default {
	getAllRepositoresByKeyWord,
}
