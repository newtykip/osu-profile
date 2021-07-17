const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const moment = require('moment');

const replaceTag = (tag, value, unicode) => {
	const regex = new RegExp(`(?<=(<!--osu-${tag}-->))(.*?)(?=\s*(<!--osu-${tag}-->))`, 'g');
	console.log(tag, value);
	return unicode.replace(regex, value);
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
					// Read the content of the readme and convert it to Unicode
					const readmeBuffer = Buffer.from(readme.content, 'base64');
					let readmeUnicode = readmeBuffer.toString('utf-8');

					// Update the Unicode, replacing all placeholders supported by the action
					readmeUnicode = replaceTag('username', res.username, readmeUnicode);					
					readmeUnicode = replaceTag('id', parseInt(res.id), readmeUnicode);
					readmeUnicode = replaceTag('global-rank', `#${parseInt(res.globalRank).toLocaleString()}`, readmeUnicode);
					readmeUnicode = replaceTag('country-rank', `#${parseInt(res.countryRank).toLocaleString()}`, readmeUnicode);					
					readmeUnicode = replaceTag('country', res.country, readmeUnicode);
					readmeUnicode = replaceTag('pp', parseInt(res.pp), readmeUnicode);
					readmeUnicode = replaceTag('level', Math.floor(res.level), readmeUnicode);
					readmeUnicode = replaceTag('time', res.timePlayed, readmeUnicode);
					readmeUnicode = replaceTag('accuracy', parseFloat(res.accuracy), readmeUnicode);
					readmeUnicode = replaceTag('join-date', moment(res.joinDate).format('ddd, MMM Do, YYYY h:mm A'), readmeUnicode);
					readmeUnicode = replaceTag('play-count', parseInt(res.playCount).toLocaleString(), readmeUnicode);
					readmeUnicode = replaceTag('ranked-score', parseInt(res.scores.ranked).toLocaleString(), readmeUnicode);
					readmeUnicode = replaceTag('total-score', parseInt(res.scores.total).toLocaleString(), readmeUnicode);
					readmeUnicode = replaceTag('ss', parseInt(res.ranks.ss.total).toLocaleString(), readmeUnicode);
					readmeUnicode = replaceTag('s', parseInt(res.ranks.s.total).toLocaleString(), readmeUnicode);
					readmeUnicode = replaceTag('a', parseInt(res.ranks.a).toLocaleString(), readmeUnicode);

					console.log(readmeUnicode);

					// Convert the Unicode back into base64
					const contentBuffer = Buffer.from(readmeUnicode, 'utf-8');
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

