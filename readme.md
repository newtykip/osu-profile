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

Each of these tags must be surrounded with a HTML comment in order for osu!profile to inject the relevant data.

For example, the tag **username** would be represented in your readme as
```
<!--osu-username---><!--osu-username--->
```

| Tag          | Replaces with...                | Example                              |
|--------------|---------------------------------|--------------------------------------|
| username     | Your username!                  | Newt x3                              |
| id           | Your profile ID!                | 16009610                             |
| global-rank  | Your global rank!               | #80,000                              |
| country-rank | Your rank in your country!      | #2,810                               |
| country      | Your country's code!            | GB                                   |
| pp           | Your overall pp!                | 4364                                 |
| level        | Your level!                     | 99                                   |
| time         | The time you have played for!   | 2 weeks, 4 days, 6 hours, 50 minutes |
| accuracy     | Your overall account accuracy!  | 99.59                                |
| join-date    | Your join date!                 | Sat, Jan 18th, 2020 7:18 PM          |
| play-count   | Your play count!                | 33,942                               |
| ranked-score | Your ranked score!              | 4,318,622,818                        |
| total-score  | Your total score!               | 22,074,479,155                       |
| ss           | The amount of SSes you have!    | 128                                  |
| s            | The amount of S ranks you have! | 558                                  |
| a            | The amount of A ranks you have! | 671                                  |

<sub>See the code's license <a href="license.md">here.</sub>
