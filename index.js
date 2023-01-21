const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const replaceTag = (tag, value, unicode) => {
    const regex = new RegExp(`(?<=(<!--osu-${tag}-->))(.*?)(?=\s*(<!--osu-${tag}-->))`, 'g');
    console.log(tag, value);
    return unicode.replace(regex, value);
};

const replaceTags = (text, pairs) => {
    pairs.forEach((pair) => {
        text = replaceTag(pair[0], pair[1], text);
    });

    return text;
};

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
    fetch(`https://newty.dev/api/osu?id=${id}`)
        .then((res) => res.json())
        .then((res) => {
            // Get the readme from the repository
            octokit.rest.repos
                .getReadme({
                    owner,
                    repo
                })
                .then(({ data: readme }) => {   
                    // Read the content of the readme and convert it to Unicode
                    const readmeBuffer = Buffer.from(readme.content, 'base64');
                    let readmeUnicode = readmeBuffer.toString('utf-8');

                    // Update the Unicode, replacing all placeholders supported by the action
                    readmeUnicode = replaceTags(readmeUnicode, [
                        ['username', res.username],
                        ['avatar', res.avatar],
                        ['id', res.id],
                        ['global-rank', res.globalRank.toLocaleString()],
                        ['country-rank', res.countryRank.toLocaleString()],
                        ['country', res.country],
                        ['country-code', res.countryCode],
                        ['pp', res.pp.toLocaleString()],
                        ['level', Math.floor(res.level)],
                        ['time', res.humanTimePlayed],
                        ['time-ms', res.timePlayedInMs.toLocaleString()],
                        ['join-date', res.joinDate],
                        ['play-count', res.playCount.toLocaleString()],
                        ['ranked-score', res.scores.ranked.toLocaleString()],
                        ['unranked-score', res.scores.unranked.toLocaleString()],
                        ['total-score', res.scores.total.toLocaleString()],
                        ['hit-count', res.hits.total.toLocaleString()],
                        ['ss', res.ranks.ss.total.toLocaleString()],
                        ['s', res.ranks.s.total.toLocaleString()],
                        ['a', res.ranks.a.toLocaleString()]
                    ]);

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
                        message: 'Updated osu! profile'
                    });
                });
        });
} catch (error) {
    core.setFailed(error.message);
}
