const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');

try {
	const id = core.getInput('ID');
	const token = core.getInput('GH_TOKEN')
	const octokit = github.getOctokit(token);
	const owner = process.env.GITHUB_REPOSITORY.split('/')[0];
	const repo = process.env.GITHUB_REPOSITORY.split('/')[1]; 
	console.log(process.env.GITHUB_REPOSITORY, owner, repo);
	
	octokit.rest.repos.get({ owner, repo })
		.then(({ data }) => {
			console.log(data.url)
		});

	// Request the user's profile information
	https.get(`https://about.newtt.me/api/osu/${id}`, (resp) => {
		// Get the data
		let data = '';		
		resp.on('data', chunk => data += chunk);

		// Parse it
		resp.on('end', () => {
			const res = JSON.parse(data);
			const rank = res.globalRank.toLocaleString();
			
		});
	});
} catch (error) {
	core.setFailed(error.message);
}

