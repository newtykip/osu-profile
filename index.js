const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const moment = require('moment');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}

const generateRegex = tag => new RegExp(`(?<=(${tag}))(.*?)(?=\s*(${tag}))`);
const replaceTags = (tags, value, ascii) => {
	let response = ascii;

	tags.forEach(tag => {
		const newTag = `<!--osu-${tag}-->`;
		console.log(`Replacing ${newTag} with ${value}`)
		ascii.replaceAll(generateRegex(newTag), value);
	});

	return response;
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
					readmeASCII = replaceTags(['name', 'username'], res.username, readmeASCII);					
					readmeASCII = replaceTags(['id'], res.id, readmeASCII);
					readmeASCII = replaceTags(['rank', 'global-rank'], `#${res.globalRank.toLocaleString()}`, readmeASCII);
					readmeASCII = replaceTags(['country-rank'], `#${res.countryRank.toLocaleString()}`, readmeASCII);					
					readmeASCII = replaceTags(['country'], res.country, readmeASCII);
					readmeASCII = replaceTags(['pp'], res.pp, readmeASCII);
					readmeASCII = replaceTags(['level'], Math.floor(res.level), readmeASCII);
					readmeASCII = replaceTags(['time'], res.timePlayed, readmeASCII);
					readmeASCII = replaceTags(['accuracy'], res.accuracy, readmeASCII);
					readmeASCII = replaceTags(['avatar', 'pfp'], `![${res.username}'s Profile Picture](${res.avatar})`, res.avatar, readmeASCII);
					readmeASCII = replaceTags(['join', 'join-date'], moment(res.joinDate).format('ddd, MMM Do, YYYY h:mm A'), readmeASCII);
					readmeASCII = replaceTags(['play', 'playcount', 'play-count'], res.playCount.toLocaleString(), readmeASCII);
					readmeASCII = replaceTags(['ranked', 'ranked-score'], res.scores.ranked.toLocaleString(), readmeASCII);
					readmeASCII = replaceTags(['score', 'total', 'total-score'], res.scores.total.toLocaleString(), readmeASCII);
					readmeASCII = replaceTags(['ss', 'ranks-ss'], res.ranks.ss.total.toLocaleString(), readmeASCII);
					readmeASCII = replaceTags(['s', 'ranks-s'], res.ranks.s.total.toLocaleString(), readmeASCII);
					readmeASCII = replaceTags(['a', 'ranks-a'], res.ranks.a.toLocaleString(), readmeASCII);

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
							name: 'rank-bot',
							email: '41898282+github-actions[bot]@users.noreply.github.com'
						}
					});
				});
		});
	});
} catch (error) {
	core.setFailed(error.message);
}

