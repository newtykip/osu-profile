# osu-profile action

This action exposes tags for you to include information about your osu! account on your GitHub profile readme.

## Inputs

### ID

**Required** Your osu! account's ID

## Example Usage

```
uses: newtykins/osu-profile@main
with:
	ID: '16009610'
```

## Tags

Every one of these placeholders must be surrounded with a HTML comment in order for osu-profile to replace it.

For example, **osu-name** would become **\<!--osu-name--->\<!--osu-name--->**

### osu-name // osu-username

Gets replaced with your username!

### osu-id

Gets replaced with your profile ID!

### osu-rank // osu-global-rank

Gets replaced with your global rank!

### osu-country-rank

Gets replaced with your rank in the country!

### osu-country

Gets replaced with your country!

### osu-pp

Gets replaced with your total pp!

### osu-level

Gets replaced with your level!

### osu-time

Gets replaced with the time you have played for!

### osu-accuracy

Gets replaced with your overall account accuracy!

### osu-avatar // osu-pfp

Gets replaced with a URL to your account's avatar!

### osu-join // osu-join-date

Gets replaced with your join date!

### osu-play // osu-playcount // osu-play-count

Gets replaced with your playcount!

### osu-ranked // osu-ranked-score

Gets replaced with your ranked score!

### osu-score // osu-total // osu-total-score

Gets replaced with your total score!

### osu-ss // osu-ranks-ss

Gets replaced with the amount of SSes you have!

### osu-s // osu-ranks-s

Gets replaced with the amount of S ranks you have!

### osu-a // osu-ranks-a

Gets replaced with the amount of A ranks you have!
