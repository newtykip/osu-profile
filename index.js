const core = require('@actions/core');
const https = require('https');

try {
	const id = core.getInput('ID');
	
	// Request the user's profile information
	https.get(`https://about.newtt.me/api/osu/${id}`, (resp) => {
		// Get the data
		let data = '';		
		resp.on('data', chunk => data += chunk);

		// Parse it
		resp.on('end', () => {
			const res = JSON.parse(data);
			const rank = res.globalRank;
			console.log(`Rank: ${rank}`, data, res);
		});
	});
} catch (error) {
	core.setFailed(error.message);
}

