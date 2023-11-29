import * as core from "@actions/core";

export default function error(message: string) {
	core.setFailed(message);
	process.exit(1);
}
