#!/usr/bin/env node
/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";
import { readFileSync, readdirSync, appendFileSync, writeFileSync } from "fs";

const committersRankingsHTMLfile = "index.html";
const issuesRankingsHTMLfile = "index-rankings-issues.html";
const PRsRankingsHTMLfile = "index-rankings-PRs.html";

const filenames = readdirSync(".").filter((file) =>
  file.endsWith("pulse.json")
);

const snapshots = [];
for (const filename of filenames) {
  console.log(filename);
  const snapshot = JSON.parse(readFileSync(filename, "utf-8").trim());
  snapshot.filename =
    filename.substring(0, filename.lastIndexOf(".json")) + ".html";
  const index = snapshots.findIndex(
    ({ full_name }) => full_name === snapshot.full_name
  );
  if (index === -1) {
    snapshots.push(snapshot);
  } else {
    snapshots[index] = snapshot;
  }
}

const generateTableFor = (key, caption, HTMLfile) => {
  if (caption === "") {
    caption = key.replaceAll("_", " ");
  }
  appendFileSync(HTMLfile, "  <table>\n");
  appendFileSync(HTMLfile, `    <caption>${caption}\n`);
  for (const s of snapshots) {
    let className = s.full_name
      .replaceAll("/", "_")
      .replaceAll("-", "_")
      .replaceAll(".", "_");
    if (s.full_name === "mdn/content") {
      className += " highlight";
    }
    const value = s[key] !== undefined ? s[key] : "N/A";
    const title = `Click to highlight the ${s.full_name} project’s rows in all tables.`;
    appendFileSync(
      HTMLfile,
      `    <tr class="${className}" title="${title}">` +
        `<td><a href="${s.filename}">${s.full_name}</a><td>${value}\n`
    );
    console.log(s.full_name + ": " + value);
  }
  appendFileSync(HTMLfile, "  </table>\n");
};

const rankCommittersDataBy = (key, caption = "") => {
  snapshots.sort((a, b) => b[key] - a[key]);
  // snapshots.sort((a, b) => {
  //   return (b[key]===undefined)-(a[key]===undefined) || +(b[key]>a[key])||-(b[key]<a[key]);
  // });
  generateTableFor(key, caption, committersRankingsHTMLfile);
};

const rankIssuesDataBy = (key, caption = "") => {
  snapshots.sort((a, b) => {
    return (
      (a[key] === undefined) - (b[key] === undefined) ||
      +(b[key] > a[key]) ||
      -(b[key] < a[key])
    );
  });
  generateTableFor(key, caption, issuesRankingsHTMLfile);
};

const rankIssuesDataAscdendingBy = (key, caption = "") => {
  snapshots.sort((a, b) => {
    return (
      (a[key] === undefined) - (b[key] === undefined) ||
      -(b[key] > a[key]) ||
      +(b[key] < a[key])
    );
  });
  generateTableFor(key, caption, issuesRankingsHTMLfile);
};

const rankPRsDataBy = (key, caption = "") => {
  snapshots.sort((a, b) => {
    return (
      (a[key] === undefined) - (b[key] === undefined) ||
      +(b[key] > a[key]) ||
      -(b[key] < a[key])
    );
  });
  generateTableFor(key, caption, PRsRankingsHTMLfile);
};

const rankPRsDataAscdendingBy = (key, caption = "") => {
  snapshots.sort((a, b) => {
    return (
      (a[key] === undefined) - (b[key] === undefined) ||
      -(b[key] > a[key]) ||
      +(b[key] < a[key])
    );
  });
  generateTableFor(key, caption, PRsRankingsHTMLfile);
};

const writeHTMLfileHeader = (HTMLfile, type) => {
  writeFileSync(
    HTMLfile,
    `<!doctype html><html lang=en><meta charset=utf-8>
<title>Pulse rankings: ${type} data</title>
<style>
  body { font-family: sans-serif; }
  body > section { margin-right: 64px; justify-content: center; }
  body > section { display: flex; flex-flow: row wrap; padding-top: 20px }
  section img { padding-top: 24px; padding-right: 12px; }
  body > div { display: flex; flex-flow: row wrap; padding-top: 20px }
  body > div { margin-bottom: 48px; }
  h1 { font-size: 28px; color: forestgreen; text-align: center; }
  h1 ~ p { text-align: center; }
  table { counter-reset: rowNumber; }
  table tr::before { display: table-cell; }
  table tr::before { padding-right: 0.3em; padding-bottom: 3px; }
  table tr::before { text-align: right; vertical-align: bottom; }
  table tr::before { counter-increment: rowNumber; }
  table tr::before { content: counter(rowNumber); }
  table { text-align: right; min-width: 330px; }
  table { margin: 2px 5px 56px 20px; border: 1px solid #ccc; }
  thead { text-align: center; vertical-align: bottom }
  th, td { padding: 8px; }
  th { background: #eee; font-size: .95em; color: forestgreen; }
  tbody tr { font-size: 13px }
  td { padding: 4px 8px; vertical-align: bottom; }
  table caption { height: 36px; }
  table caption { padding-bottom: 6px; margin-top: 8px }
  table caption { font-weight: bold; color: forestgreen; }
  caption::first-letter { text-transform:capitalize; }
  td a { font-weight: normal; vertical-align: bottom; }
  tbody tr.highlight { background: #00ff28 !important; color: white; }
  tbody tr.highlight { color: #111 !important; }
  tbody tr.highlight a { color: #111 !important; }
  tbody tr.highlight:nth-child(even) { background: #00ff28 !important; }
  tbody tr:nth-child(even) { background: #eee; }
  tbody tr:nth-child(even) { font-weight: bold; color: forestgreen; }
  tfoot tr td { border-top: 1px solid #ccc; padding-top: 8px }
  tfoot tr td { text-align: center; font-size: 13px;}
  div ~ p { margin-top: -72px; margin-left: 20px; }
</style>
<section>
  <div>
    <a href="https://github.com/git-pulse/tools">
      <img alt="git-pulse logo" src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzkuMDggMzM2LjUyIj4NCiAgPHJhZGlhbEdyYWRpZW50DQogICAgICBpZD0icmFkaWFsR3JhZGllbnQzNzM0Ig0KICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiDQogICAgICBjeT0iNjkwLjI4Ig0KICAgICAgY3g9IjQ2Ny43MSINCiAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTQuNTcyIC0uMDAyMDExOSAuMDE2OTM5IDE4MC4wOSAtNjM1OS40IC0xLjIzNDVlNSkiDQogICAgICByPSI0MC42MjMiPg0KICAgIDxzdG9wIGlkPSJzdG9wMzczMCIgc3R5bGU9InN0b3AtY29sb3I6IzIyOEIyMiIgb2Zmc2V0PSIwIiAvPg0KICAgIDxzdG9wIGlkPSJzdG9wMzczMiIgc3R5bGU9InN0b3AtY29sb3I6IzIyOEIyMjtzdG9wLW9wYWNpdHk6MCIgb2Zmc2V0PSIxIiAvPg0KICA8L3JhZGlhbEdyYWRpZW50Pg0KICA8ZyBpZD0ibGF5ZXIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDY3LjcxIC02MjMuNTMpIj4NCiAgICA8cGF0aCBpZD0icGF0aDIzOTYiDQogICAgICAgIHN0eWxlPSJzdHJva2U6dXJsKCNyYWRpYWxHcmFkaWVudDM3MzQpO3N0cm9rZS13aWR0aDoyNC4wNDU7ZmlsbDpub25lIg0KICAgICAgICBkPSJtNDc5LjczIDg1MC42OHMxOS42OSAxMSAyNi4zNSAxNy44NGMxMCAxMC4yNyAxOS4wNSA1Mi45OCAyNS43IDQwLjI4IDQwLjItNzYuNzYgNTguMTItMjczLjI1IDU4LjEyLTI3My4yNXMwLjM3IDEyNS4zOSA3LjQzIDE3OC41M2M1LjM0IDQwLjI2IDE5LjY3IDE0OS43MSAyOS44NyAxMzIuMDIgMTcuMDItMjkuNTEgMjIuNjMtODcuMTYgMzIuOTctMTI2LjY1IDQuOTUtMTguOTIgMTguNjMgMzcuOTcgMzEuMjMgNTcuMjYgNS43MiA4Ljc2IDQuOTYtMzMuMTkgMTUuNjEtMzIuMSAyNi4wMyAyLjY2IDI3Ljc2IDAuODcgMjcuNzYgMC44NyIgLz4NCiAgPC9nPg0KPC9zdmc%2B" height="75">
    </a>
  </div>
  <div>
    <h1>Pulse rankings: ${type} data</h1>
    `
  );
  appendFileSync(
    HTMLfile,
    `<p>
    <a href="${committersRankingsHTMLfile}">Committers</a>
    •
    <a href="${issuesRankingsHTMLfile}">Issues</a>
    •
    <a href="${PRsRankingsHTMLfile}">PRs</a>
    <p>
    <i>Click on any row to highlight the given project’s rows in all tables.</i>
    <p>
    <i>Click on any project name to view the latest
      <a href="https://github.com/git-pulse/tools#pulse-snapshots">pulse snapshot</a>
      for that project.</i>
  </div>
</section>
<div>
`
  );
};

const writeHTMLfileFooter = (HTMLfile) => {
  appendFileSync(
    HTMLfile,
    `</div>
<p>
<a href="https://github.com/git-pulse/tools">
  <img height=18 alt="git-pulse logo" src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNzkuMDggMzM2LjUyIj4NCiAgPHJhZGlhbEdyYWRpZW50DQogICAgICBpZD0icmFkaWFsR3JhZGllbnQzNzM0Ig0KICAgICAgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiDQogICAgICBjeT0iNjkwLjI4Ig0KICAgICAgY3g9IjQ2Ny43MSINCiAgICAgIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMTQuNTcyIC0uMDAyMDExOSAuMDE2OTM5IDE4MC4wOSAtNjM1OS40IC0xLjIzNDVlNSkiDQogICAgICByPSI0MC42MjMiPg0KICAgIDxzdG9wIGlkPSJzdG9wMzczMCIgc3R5bGU9InN0b3AtY29sb3I6IzIyOEIyMiIgb2Zmc2V0PSIwIiAvPg0KICAgIDxzdG9wIGlkPSJzdG9wMzczMiIgc3R5bGU9InN0b3AtY29sb3I6IzIyOEIyMjtzdG9wLW9wYWNpdHk6MCIgb2Zmc2V0PSIxIiAvPg0KICA8L3JhZGlhbEdyYWRpZW50Pg0KICA8ZyBpZD0ibGF5ZXIxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDY3LjcxIC02MjMuNTMpIj4NCiAgICA8cGF0aCBpZD0icGF0aDIzOTYiDQogICAgICAgIHN0eWxlPSJzdHJva2U6dXJsKCNyYWRpYWxHcmFkaWVudDM3MzQpO3N0cm9rZS13aWR0aDoyNC4wNDU7ZmlsbDpub25lIg0KICAgICAgICBkPSJtNDc5LjczIDg1MC42OHMxOS42OSAxMSAyNi4zNSAxNy44NGMxMCAxMC4yNyAxOS4wNSA1Mi45OCAyNS43IDQwLjI4IDQwLjItNzYuNzYgNTguMTItMjczLjI1IDU4LjEyLTI3My4yNXMwLjM3IDEyNS4zOSA3LjQzIDE3OC41M2M1LjM0IDQwLjI2IDE5LjY3IDE0OS43MSAyOS44NyAxMzIuMDIgMTcuMDItMjkuNTEgMjIuNjMtODcuMTYgMzIuOTctMTI2LjY1IDQuOTUtMTguOTIgMTguNjMgMzcuOTcgMzEuMjMgNTcuMjYgNS43MiA4Ljc2IDQuOTYtMzMuMTkgMTUuNjEtMzIuMSAyNi4wMyAyLjY2IDI3Ljc2IDAuODcgMjcuNzYgMC44NyIgLz4NCiAgPC9nPg0KPC9zdmc%2B"
></a>
<small>Generated with <a href="https://github.com/git-pulse/tools">git-pulse-rank.js</a></small>
<script>
const classToHighlight = localStorage.getItem("classToHighlight");
if (classToHighlight) {
  document.querySelectorAll(".highlight")
    .forEach((element) => element.classList.remove("highlight"));
  document.querySelectorAll("." + classToHighlight)
  .forEach((element) => element.classList.add("highlight"));
}
document.body.onclick = (e) => {
  if (e.target.tagName === "A") {
    return;
  }
  document.querySelectorAll(".highlight")
    .forEach((element) => element.classList.remove("highlight"));
  const className = e.target.parentNode.className;
  document.querySelectorAll("." + className)
    .forEach((element) => element.classList.add("highlight"));
  localStorage.setItem("classToHighlight", className);
}
</script>
`
  );
};

writeHTMLfileHeader(committersRankingsHTMLfile, "committer");
rankCommittersDataBy("new_committers_per_month");
rankCommittersDataBy("new_committers_percentage");
rankCommittersDataBy("total_active_committers_per_month");
rankCommittersDataBy("commits_per_month");
rankCommittersDataBy("cumulative_total_committers");
rankCommittersDataBy("forks_count");
rankCommittersDataBy("commits_per_committer_per_month");
writeHTMLfileFooter(committersRankingsHTMLfile);

writeHTMLfileHeader(issuesRankingsHTMLfile, "issue");
rankIssuesDataBy("issues_opened_per_month");
rankIssuesDataBy("issues_closed_per_month");
rankIssuesDataAscdendingBy(
  "issues_open_to_monthly_ratio",
  `How many times as many open issues as the average # of issues
    opened per month?`
);
rankIssuesDataBy(
  "issues_resolved_to_commits_percentage",
  "Percentage ratio of total closed issues to total commits"
);
rankIssuesDataBy(
  "issues_closed_percentage",
  `Net closure rate for issues (% of new issues resolved each month
    on average)`
);
rankIssuesDataBy("issues_resolved_count");
rankIssuesDataBy(
  "issues_resolved_to_open_ratio",
  "How many times as many closed issues as open issues?"
);
rankIssuesDataAscdendingBy("issues_open_count");
rankIssuesDataAscdendingBy(
  "issues_increase_decrease",
  "Average increase or decrease in open issues per month"
);
writeHTMLfileFooter(issuesRankingsHTMLfile);

writeHTMLfileHeader(PRsRankingsHTMLfile, "PR");
rankPRsDataBy("PRs_opened_per_month");
rankPRsDataBy("PRs_merged_per_month");
rankPRsDataBy("PRs_closed_per_month");
rankPRsDataAscdendingBy(
  "PRs_open_to_monthly_ratio",
  `How many times as many open PRs as the average # of PRs
    opened per month?`
);
rankPRsDataBy(
  "PRs_merged_vs_commits_ratio",
  `What % of commits come from PRs?<br>
    (av. monthly commits / av. monthly PRs)`
);
rankPRsDataBy(
  "PRs_resolved_to_open_ratio",
  "How many times as many closed PRs as open PRs?"
);
rankPRsDataBy("PRs_resolved_count");
rankPRsDataBy(
  "PRs_merged_or_closed_percentage",
  `Net closure rate for PRs (% of new PRs resolved each month
    on average)`
);
rankPRsDataAscdendingBy("PRs_open_count");
rankPRsDataAscdendingBy(
  "PRs_increase_decrease",
  "Average increase or decrease in open PRs per month"
);
writeHTMLfileFooter(PRsRankingsHTMLfile);
