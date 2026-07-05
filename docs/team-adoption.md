# Team Adoption Guide

## Phase 1 - Pilot
- start with one repo
- keep existing conventions
- map conventions into contracts
- run validate before every build workflow

## Phase 2 - Stabilize
- add shared workflow gates
- reduce CI failures by failing earlier locally
- require reflection artifact in review preparation

## Phase 3 - Scale
- replicate profile across repos
- tune only profile details, keep framework stable
- track maturity and quality signals monthly

## Suggested metrics
- CI failure rate from avoidable issues
- convention adherence rate
- accepted PR quality on first pass
- cost per accepted artifact

## Evidence collection for review and scoring
Capture one evidence snapshot each week:
- number of scaffolded projects
- number of validate runs
- number of run workflow executions
- CI failures prevented before PR
- examples of convention drift caught by gates

Store evidence in a lightweight, reviewable format:
- one markdown summary per week
- links to PRs, issues, or artifacts
- one paragraph on what improved and what still needs work

## Minimum pilot evidence package
For one pilot repo, provide:
1. before baseline for CI or convention drift
2. after snapshot at week 2 or week 4
3. one concrete example where validation prevented rework
4. one reflection insight promoted into team conventions
