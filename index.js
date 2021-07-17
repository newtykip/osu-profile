const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const moment = require('moment');

const replaceTag = (tag, value, ascii) => {
	const regex = new RegExp(`(?<=(<!--osu-${tag}-->))(.*?)(?=\s*(<!--osu-${tag}-->))`, 'g');
	console.log(tag, value);
	return ascii.replace(regex, value);
}

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
			console.log(res);

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
					readmeASCII = replaceTag('username', res.username, readmeASCII);					
					readmeASCII = replaceTag('id', parseInt(res.id), readmeASCII);
					readmeASCII = replaceTag('global-rank', `#${parseInt(res.globalRank).toLocaleString()}`, readmeASCII);
					readmeASCII = replaceTag('country-rank', `#${parseInt(res.countryRank).toLocaleString()}`, readmeASCII);					
					readmeASCII = replaceTag('country', res.country, readmeASCII);
					readmeASCII = replaceTag('pp', parseInt(res.pp), readmeASCII);
					readmeASCII = replaceTag('level', Math.floor(res.level), readmeASCII);
					readmeASCII = replaceTag('time', res.timePlayed, readmeASCII);
					readmeASCII = replaceTag('accuracy', parseFloat(res.accuracy), readmeASCII);
					readmeASCII = replaceTag('join-date', moment(res.joinDate).format('ddd, MMM Do, YYYY h:mm A'), readmeASCII);
					readmeASCII = replaceTag('play-count', parseInt(res.playCount).toLocaleString(), readmeASCII);
					readmeASCII = replaceTag('ranked-score', parseInt(res.scores.ranked).toLocaleString(), readmeASCII);
					readmeASCII = replaceTag('total-score', parseInt(res.scores.total).toLocaleString(), readmeASCII);
					readmeASCII = replaceTag('ss', parseInt(res.ranks.ss.total).toLocaleString(), readmeASCII);
					readmeASCII = replaceTag('s', parseInt(res.ranks.s.total).toLocaleString(), readmeASCII);
					readmeASCII = replaceTag('a', parseInt(res.ranks.a).toLocaleString(), readmeASCII);

					console.log(readmeASCII);

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
						message: 'Updated osu! profile',
						committer: {
							name: 'osu-bot',
							email: '41898282+github-actions[bot]@users.noreply.github.com'
						}
					});
				});
		});
	});
} catch (error) {
	core.setFailed(error.message);
}

