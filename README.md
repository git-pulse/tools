**How to:** Show a [pulse snapshot](#pulse-snapshots) of the past 6 months of committer activity and issue/PR activity for any git/GitHub repo by doing this: `cd` into your local clone of any repo, and run the following:

```bash
curl -fsSLO https://git-pulse.github.io/tools/git-pulse && bash ./git-pulse 6
```

Example output:

```
           Committers
┌────────────────────┬───────┐
│      Monthly       │ Cu-   │
├─────┬───────┬──────┤ mula- │ Monthly
│ New │ Total │ %New │ tive  │ commits             Month range
├─────┼───────┼──────┼───────┼───────┬───────────────────────────────────────┐
│ 120 │   167 │   71 │  1366 │   385 │ Nov 01 – Dec 01 2021 ending 5mo ago   │
│ 115 │   166 │   69 │  1481 │   398 │ Dec 01 – Jan 01 2022 ending 4mo ago   │
│ 157 │   221 │   71 │  1638 │   572 │ Jan 01 – Feb 01 2022 ending 3mo ago   │
│ 111 │   169 │   65 │  1749 │   468 │ Feb 01 – Mar 01 2022 ending 2mo ago   │
│ 163 │   222 │   73 │  1912 │   692 │ Mar 01 – Apr 01 2022 ending 1mo ago   │
│ 120 │   192 │   62 │  2032 │   679 │ Apr 01 – May 01 2022 ending today     │
└─────┴───────┴──────┴───────┴───────┴───────────────────────────────────────┘

 For the last 6 months:

     131 new committers per month on average.
     189 total active committers per month on average.
      69 percent of committers were new committers.
     532 commits per month on average.

 Cumulative total committers grew by 666 (from 1366 to 2032) in 5 months.
```

![image](https://user-images.githubusercontent.com/194984/166609194-9380ed86-1282-45da-842a-d8ac4e6d4e96.png)

```
┌────────────────┬─────────────────────┐
│     Issues     │         PRs         │
├────────────────┼─────────────────────┤
│ Clsd Opnd   +- │ Mrgd Clsd Opnd   +- │             Month range
├────────────────┼─────────────────────┼───────────────────────────────────────┐
│  169  215   46 │  373   42  424    9 │ Nov 01 - Dec 01 2021 ending 5mo ago   │
│  229  244   15 │  401   36  440    3 │ Dec 01 - Jan 01 2022 ending 4mo ago   │
│  223  227    4 │  569   90  669   10 │ Jan 01 - Feb 01 2022 ending 3mo ago   │
│  188  195    7 │  470   49  526    7 │ Feb 01 - Mar 01 2022 ending 2mo ago   │
│  305  336   31 │  692   55  744   -3 │ Mar 01 - Apr 01 2022 ending 1mo ago   │
│  162  199   37 │  673   62  755   20 │ Apr 01 - May 01 2022 ending today     │
└────────────────┴─────────────────────┴───────────────────────────────────────┘
 For the last 6 months:

     212 issues closed per month on average.
     236 issues opened per month on average.
      23 issue increase in open issues per month on average.

     529 PRs merged per month on average.
      99 percent merged PRs / commits ratio
         (average 529 merged PRs vs average 532 commits).
      55 PRs closed (unmerged) per month on average.
     593 PRs opened per month on average.
       7 PR increase in open PRs per month on average.

     140 issue increase in open issues overall.
      46 PR increase in open PRs overall.
```

![image](https://user-images.githubusercontent.com/194984/166609488-ea747459-6477-4b41-b26f-4859f55c104b.png)

## Pulse snapshots

A **pulse snapshot** is a report that answers questions about a project such as the following:

- **How many contributors are actually active each month?**
- **How many new contributors is the project gaining each month?**
- **How many commits are getting merged each month?**
- **How well is the project managing issues and PRs?**
  - **How long does an issue or PR typically stay open before it’s resolved?**
  - **How many issues and PRs are there which have stayed open for a long time without being resolved?**
  - **At what rate are the lists of open issues and PRs increasing or decreasing?**

The `git-pulse` tool generates snapshots with data and graphs that answer those questions.

### Notes on using the git-pulse tool

- The month ranges shown are for logical months based on the current date (today) rather than calendar months. That is, each “month” range shown ends on the same calendar day as today — rather than being a calendar month starting on the 1st of a given month and ending on the 30th, 31st, 28th, or 29th.

- Unless you have either `GITHUB_TOKEN` or `GH_TOKEN` set in your environment, running this tool will likely cause you to quickly exceed the GitHub API rate limits for requests, and start getting 403 error responses.

- Even with `GITHUB_TOKEN`/`GH_TOKEN` set, the tool takes several minutes to run, due to throttling (delay between API calls) added to avoid hitting GitHub API rate limits for (authenticated) requests.

  To adjust the throttling (seconds between API calls), run with `-s` option set to a number of seconds (default is 9):

  ```
  bash ./git-pulse -s10
  ```

- To generate a snapshot for a date range going back from an earlier day than today, install `faketime` (e.g., with `apt install faketime` or `brew install faketime`) and run `git-pulse` like this:

  ```
  faketime -f "@2021-05-01 23:59:59" bash ./git-pulse
  ```

  **Note:** `faketime` won’t work on macOS or other systems with the BSD `date` command. On such systems, use the `-d` option to specify the GNU `date` command rather than the default `date` command; for example, on a macOS system, install the [Homebrew `coreutils` package](https://formulae.brew.sh/formula/coreutils), and run with the `-d` option set like this:

  ```
  brew install coreutils
  faketime -f "@2021-05-01 23:59:59" bash ./git-pulse -d/usr/local/bin/gdate
  ```

- If a repo/clone has a remote named `upstream` defined, the tool uses that remote; otherwise it uses `origin`.

- Add the directory containing the `git-pulse` script to your `$PATH`, so you can use the `git pulse` to run it:

  ```bash
  mkdir git-pulse && cd git-pulse
  git clone https://github.com/git-pulse/tools.git
  cd tools
  echo export PATH=\"$PATH:$PWD\" >> ~/.bash_profile
  ```

  Now you can run `git pulse` in any repo/clone directory to get a pulse snapshot for that repo.

## Pulse rankings

**How to:** Generate a [pulse rankings](https://git-pulse.github.io/snapshots/) report in a directory containing multiple `*-pulse.json` snapshots:

```bash
node tools/git-pulse-rank.js
```
