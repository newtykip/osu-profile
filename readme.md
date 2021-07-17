# osu-profile action

This action exposes placeholders for you to include information about your osu! account on your GitHub profile readme.

## Placeholders

### \<!--osu-id-->\<!--osu-id-->

Gets replaced with your osu profile ID!

#### \<!--osu-rank-->\<!--osu-rank-->

Gets replaced with your global rank on osu!

## Inputs

### ID

**Required** Your osu! account's ID

## Example Usage

```
uses: newtykins/osu-profile@main
with:
	ID: '16009610'
```
