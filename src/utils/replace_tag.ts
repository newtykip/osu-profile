export default function replace_tag(original: string, tag: string, value: string): string {
	console.log(`${tag} = ${value}`);
	
	const regex = new RegExp(`(?<=(<!-- ?osu-${tag} ?-->))(.*)(?=\s*(<!-- ?osu-${tag} ?-->))`, "g");
	return original.replace(regex, value);
}
