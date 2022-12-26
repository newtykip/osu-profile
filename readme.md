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

| Tag            | Replaces with...                    | Example                                                                     |
| -------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| username       | Your username!                      | <!--osu-username-->Newt x3<!--osu-username-->                               |
| avatar         | Your avatar!                        | ![](<!--osu-avatar-->https://a.ppy.sh/16009610<!--osu-avatar-->)                                     |
| id             | Your profile ID!                    | <!--osu-id-->16009610<!--osu-id-->                                          |
| global-rank    | Your global rank!                   | <!--osu-global-rank-->54,477<!--osu-global-rank-->                         |
| country-rank   | Your rank in your country!          | <!--osu-country-rank-->1,965<!--osu-country-rank-->                        |
| country        | Your country!                       | <!--osu-country-->United Kingdom<!--osu-country-->                          |
| country-code   | Your country's code!                | <!--osu-country-code-->GB<!--osu-country-code-->                            |
| pp             | Your overall pp!                    | <!--osu-pp-->5,171.41<!--osu-pp-->                                              |
| level          | Your level!                         | <!--osu-level-->100<!--osu-level-->                                         |
| time-ms        | The time you have played for in ms! | <!--osu-time-ms-->2,747,914,000<!--osu-time-ms-->                                        |
| time           | The time you have played for!       | <!--osu-time-->1 month, 1 day, 8 hours, 48 minutes, and 34 secondsssssssssssssssssssssssssssssssssssssssssssssssssssssssssss<!--osu-time--> |
| accuracy       | Your overall account accuracy!      | <!--osu-accuracy-->99.52<!--osu-accuracy-->                                 |
| join-date      | Your join date!                     | <!--osu-join-date-->Invalid date<!--osu-join-date-->         |
| play-count     | Your play count!                    | <!--osu-play-count-->60,109<!--osu-play-count-->                            |
| ranked-score   | Your ranked score!                  | <!--osu-ranked-score-->8,552,254,033<!--osu-ranked-score-->                 |
| unranked-score | Your unranked score!                | <!--osu-unranked-score-->38,752,991,681<!--osu-unranked-score-->                          |
| total-score    | Your total score!                   | <!--osu-total-score-->47,305,245,714<!--osu-total-score-->                  |
| hit-count      | Your total hit count!               | <!--osu-hit-count-->8,953,004<!--osu-hit-count-->                                    |
| ss             | The amount of SSes you have!        | <!--osu-ss-->158<!--osu-ss-->                                               |
| s              | The amount of S ranks you have!     | <!--osu-s-->740<!--osu-s-->                                                 |
| a              | The amount of A ranks you have!     | <!--osu-a-->974<!--osu-a-->                                                 |

<sub>See the code's license <a href="license.md">here.</sub>
