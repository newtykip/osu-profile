const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');

const generateRegex = tag => new RegExp(`(?<=(${tag}))(.*?)(?=\s*(${tag}))`);
const replacePlaceholder = (placeholder, value, ascii) => ascii.replace(generateRegex(placeholder), value);

try {
	// Take from input
	const id = core.getInput('ID');
	const token = core.getInput('GH_TOKEN');

	// Create an instance of octokit
	const octokit = github.getOctokit(token);

	// Figure out repository details
	const owner = process.env.GITHUB_REPOSITORY.split('/')[0];
	const repo = process.env.GITHUB_REPOSITORY.split('/')[1]; 

	// Request the user's profile information
	https.get(`https://about.newtt.me/api/osu/${id}`, (resp) => {
		// Get the profile's data
		let data = '';		
		resp.on('data', chunk => data += chunk);

		// Parse it
		resp.on('end', () => {
			const res = JSON.parse(data);
			const rank = `#${res.globalRank.toLocaleString()}`;

			// Get the readme from the repository
			octokit.rest.repos.getReadme({
				owner,
				repo,
			})
				.then(({ data: readme }) => {
					// Read the content of the readme and convert it to ASCII
					const readmeBuffer = Buffer.from(readme.content, 'base64');
					let readmeASCII = readmeBuffer.toString('ascii');

					// Update the ASCII, replacing all placeholders supported by the action
					readmeASCII = replacePlaceholder('<!--osu-rank-->', rank);

					// Convert the ASCII back into base64
					const contentBuffer = Buffer.from(readmeASCII, 'ascii');
					const content = contentBuffer.toString('base64');

					// Update the readme
					octokit.rest.repos.createOrUpdateFileContents({
						owner,
						repo,
						path: readme.path,
						sha: readme.sha,
						content,
						message: 'Updated osu! rank',
						committer: {
							name: 'osu-rank-bot',
							email: '41898282+github-actions[bot]@users.noreply.github.com'
						}
					});
				});
		});
	});
} catch (error) {
	core.setFailed(error.message);
}

