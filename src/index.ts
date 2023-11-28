import * as core from "@actions/core";
import * as github from "@actions/github";
import { v1, auth } from "osu-api-extended";

async function run() {
	// set osu! api key
	const api_key = core.getInput("api-key");
	auth.set_v1(api_key);
	
	// validate game mode
	const game_mode = core.getInput("game-mode");
	
	if (game_mode !== "osu" && game_mode !== "taiko" && game_mode !== "fruits" && game_mode !== "mania") {
		core.setFailed("Invalid game mode.");
		process.exit(1);
	}
	
	// get profile data
	const profile_id = core.getInput("profile-id");
	const profile = await v1.user.details(profile_id, {
		mode: game_mode,
		type: "id"
	});
	
	console.log(profile.name)
}

run();
