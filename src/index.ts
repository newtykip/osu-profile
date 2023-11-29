import * as core from "@actions/core";
import * as github from "@actions/github";
import { v1, auth } from "osu-api-extended";
import replace_tag from "./utils/replace_tag";
import format_date from "./utils/format_date";
import error from "./utils/error";
import humanize_time from "./utils/humanize_time";

async function run() {
	// set osu! api key
	const api_key = core.getInput("api-key");
	auth.set_v1(api_key);
	
	// validate game mode
	const game_mode = core.getInput("game-mode");
	
	if (game_mode !== "osu" && game_mode !== "taiko" && game_mode !== "fruits" && game_mode !== "mania") {
		error("Invalid game mode.");
	}
	
	// get profile data
	const profile_id = core.getInput("profile-id");
	const profile = await v1.user.details(profile_id, {
		mode: game_mode as any,
		type: "id"
	});
	
	console.log(`Found data for profile ${profile.name}`);
	
	// instantiate octokit
	const github_token = core.getInput("token");
	const octokit = github.getOctokit(github_token);

	// find repository information
	const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
	const ref = process.env.GITHUB_REF;
	const branch = ref.split("/").slice(2).join("/");
	console.log(`Found repository ${owner}/${repo} (${branch})`);

	// get file
	const path = core.getInput("file-path");
	let file;

	try {
		file = (path ? await octokit.rest.repos.getContent({
			owner, repo, ref, path
		}) : await octokit.rest.repos.getReadme({
			owner, repo, ref
		})).data;
	} catch {
		error("Failed to find file.");
	}

	console.log(`Modifying file ${file["path"]}`);
	
	// manipulate file
	let file_content = Buffer.from(file["content"], "base64").toString("utf-8");

	[
		["last-updated", format_date(undefined)],
		["id", profile.id],
		["avatar", `https://a.ppy.sh/${profile.id}`],
		["name", profile.name],
		["pp", Math.round(profile.pp).toLocaleString()],
		["accuracy", profile.acc],
		["level", Math.floor(profile.lvl).toLocaleString()],
		["join-date", format_date(profile.join)],

		["country", profile.country.full],
		["country-short", profile.country.short],

		["play-count", profile.play.count.toLocaleString()],
		["play-time", humanize_time(profile.play.time * 1000)],

		["hit-count", Object.values(profile.hits).reduce((a, b) => a + b).toLocaleString()],
		["50-count", profile.hits[50].toLocaleString()],
		["100-count", profile.hits[100].toLocaleString()],
		["300-count", profile.hits[300].toLocaleString()],

		["total-score", profile.score.total.toLocaleString()],
		["ranked-score", profile.score.ranked.toLocaleString()],

		["global-rank", profile.rank.global.toLocaleString()],
		["country-rank", profile.rank.country.toLocaleString()],

		["ssh-count", profile.ranks.ssh.toLocaleString()],
		["ss-count", profile.ranks.ss.toLocaleString()],
		["sh-count", profile.ranks.sh.toLocaleString()],
		["s-count", profile.ranks.s.toLocaleString()],
		["a-count", profile.ranks.a.toLocaleString()]
	].forEach(([tag, value]: string[]) => {
		file_content = replace_tag(file_content, tag, value);
	});

	// update the readme
	const encoded_content = Buffer.from(file_content).toString("base64");

	await octokit.rest.repos.createOrUpdateFileContents({
		owner,
		repo,
		branch,
		path: file["path"],
		sha: file["sha"],
		content: encoded_content,
		message: "Updated osu! profile data",
		committer: {
			name: "osu!profile",
			email: "osu-profile@newty.dev"
		}
	});
}

run();
