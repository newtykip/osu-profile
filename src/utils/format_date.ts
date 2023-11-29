import * as dayjs from "dayjs";

export default function format_date(input: string | number | dayjs.Dayjs | Date | undefined): string {
	const date = typeof input == "number" ? dayjs.unix(input) : dayjs(input);
	return `${date.format('DD/MM/YYYY HH:mm')} GMT`;
}
