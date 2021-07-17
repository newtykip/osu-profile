# osu-profile action

This action exposes placeholders for you to include information about your osu! account on your GitHub profile readme.

## Inputs

### ID

**Required** Your osu! account's ID

## Example Usage

```
uses: newtykins/osu-profile@main
with:
	ID: '16009610'
```

## Placeholders

### \<!--osu-name-->\<!--osu-name--> or \<!--osu-username-->\<!--osu-username-->

Gets replaced with your username!

### \<!--osu-id-->\<!--osu-id-->

Gets replaced with your profile ID!

### \<!--osu-rank-->\<!--osu-rank--> or \<!--osu-global-rank-->\<!--osu-global-rank--> 

Gets replaced with your global rank!

### \<!--osu-country-rank-->\<!--osu-country-rank-->

Gets replaced with your rank in the country!

### \<!--osu-country-->\<!--osu-country-->

Gets replaced with your country!

### \<!--osu-pp-->\<!--osu-pp-->

Gets replaced with your total pp!

### \<!--osu-level-->\<!--osu-level-->

Gets replaced with your level!

### \<!--osu-time-->\<!--osu-time-->

Gets replaced with the time you have played for!

### \<!--osu-accuracy-->\<!--osu-accuracy-->

Gets replaced with your overall account accuracy!

### \<!--osu-avatar-->\<!--osu-avatar-->

Gets replaced with a URL to your account's avatar!

### \<!--osu-join-date-->\<!--osu-join-date-->

Gets replaced with your join date!

### \<!--osu-playcount-->\<!--osu-playcount-->

Gets replaced with your playcount!

### \<!--osu-ranked-score-->\<!--osu-ranked-score-->

Gets replaced with your ranked score!

### \<!--osu-total-score-->\<!--osu-total-score-->

Gets replaced with your total score!

### \<!--osu-ranks-ss-->\<!--osu-ranks-ss-->

Gets replaced with the amount of SSes you have!

### \<!--osu-ranks-s-->\<!--osu-ranks-s-->

Gets replaced with the amount of S ranks you have!

### \<!--osu-ranks-a-->\<!--osu-ranks-a-->

Gets replaced with the amount of A ranks you have!
