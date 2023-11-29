import * as humanize from 'humanize-duration';

export default function humanize_time(ms: number) {
	return humanize(ms, {
		round: true,
		conjunction: " and "
	})
}
