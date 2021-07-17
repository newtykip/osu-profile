const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const countries = require('i18n-iso-countries');
const moment = require('moment');

const generateRegex = tag => new RegExp(`(?<=(${tag}))(.*?)(?=\s*(${tag}))`);
const replacePlaceholder = (placeholders, value, ascii) => {
	let response = ascii;

	placeholders.forEach(placeholder => {
		response = ascii.replace(generateRegex(placeholder), value);	
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
					readmeASCII = replacePlaceholder(['<!--osu-name-->', '<!--osu-username-->'], res.username, readmeASCII);					
					readmeASCII = replacePlaceholder(['<!--osu-id-->'], res.id, readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-rank-->', '<!--osu-global-rank-->'], `#${res.globalRank.toLocaleString()}`, readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-country-rank-->'], `#${res.countryRank.toLocaleString()}`, readmeASCII);					
					readmeASCII = replacePlaceholder(['<!--osu-country-->'], countries.getName(res.country), readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-pp-->'], res.pp, readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-level-->'], Math.floor(res.level), readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-time-->'], res.timePlayed, readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-accuracy-->'], res.accuracy, readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-avatar-->'], res.avatar, readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-join-date-->'], moment(res.joinDate).format('ddd, MMM Do, YYYY h:mm A'), readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-playcount-->'], res.playCount.toLocaleString(), readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-ranked-score-->'], res.scores.ranked.toLocaleString(), readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-total-score-->'], res.scores.total.toLocaleString(), readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-ranks-ss-->'], res.ranks.ss.total.toLocaleString(), readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-ranks-s-->'], res.ranks.s.total.toLocaleString(), readmeASCII);
					readmeASCII = replacePlaceholder(['<!--osu-ranks-a-->'], res.ranks.a.total.toLocaleString(), readmeASCII);

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

