<div align="center">
    <img src="readme.gif">
    <h1>osu!profile</h1>
</div>

osu!profile is a GitHub Action that makes use of [newtt.me](https://newtt.me/)'s /api/osu endpoint to get statistics about an osu! profile, and inject them into a GitHub profile readme.

It makes use of HTML comments and tags to inject this data - you can find important information about using this action for yourself below.

The code is incredibly scuffed, and so is this entire project - please be patient, this is my first ever attempt at making an action or anything with the GitHub API at all for that matter. I might come back to this in the future when I am more experienced and make it a tad more seamless, but for now it is what it is! (feel free to contribute if there is anything you feel like you could do to improve the project though, contributions are always appreciated <3)

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

Each of these tags must be surrounded in a HTML comment in order for osu!profile to inject the relevant data. You can check out the [**raw version**](https://raw.githubusercontent.com/newtykins/osu-profile/main/readme.md) of this readme to see examples of the tags below!


| Tag          | Replaces with...                | Example                                        |
|--------------|---------------------------------|------------------------------------------------|
| username     | Your username!                  | <!--osu-username--><!--osu-username-->         |
| id           | Your profile ID!                | <!--osu-id--><!--osu-id-->                     |
| global-rank  | Your global rank!               | <!--osu-global-rank--><!--osu-global-rank-->   |
| country-rank | Your rank in your country!      | <!--osu-country-rank--><!--osu-country-rank--> |
| country      | Your country's code!            | <!--osu-country--><!--osu-country-->           |
| pp           | Your overall pp!                | <!--osu-pp--><!--osu-pp-->                     |
| level        | Your level!                     | <!--osu-level--><!--osu-level-->               |
| time         | The time you have played for!   | <!--osu-time--><!--osu-time-->                 |
| accuracy     | Your overall account accuracy!  | <!--osu-accuracy--><!--osu-accuracy-->         |
| join-date    | Your join date!                 | <!--osu-join-date--><!--osu-join-date-->       |
| play-count   | Your play count!                | <!--osu-play-count--><!--osu-play-count-->     |
| ranked-score | Your ranked score!              | <!--osu-ranked-score--><!--osu-ranked-score--> |
| total-score  | Your total score!               | <!--osu-total-score--><!--osu-total-score-->   |
| ss           | The amount of SSes you have!    | <!--osu-ss--><!--osu-ss-->                     |
| s            | The amount of S ranks you have! | <!--osu-s--><!--osu-s-->                       |
| a            | The amount of A ranks you have! | <!--osu-a--><!--osu-a-->                       |


<sub>See the code's license <a href="license.md">here.</sub>
