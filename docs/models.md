# 365 days of models
> Domain models for `365 days of` API.

## User
A `User` is a person trying to achieve a goal.
A `User` has a list of **goals** he/she's trying to achieve.
A `User` has a list of **challenges** other users have put him/her.
A `User` has a list of **role models** who he/she follows and inspire him with their progress.

### `User` members

#### `User#email`
`{String}` `read-only` `required` `unique` Serves as an **identifier**.

#### `User#name`
`{String}` `required`.

#### `User#alias`
`{String}` A person's moniker.

#### `User#goals`
`{Goal[]}` `read-only` List of `Goal` a person is trying to achieve.

#### `User#challenges`
`{Goal[]}` `read-only` List of `Goal` that were put by someone else a person is trying to achieve.

#### `User#roleModels`
`{User[]}` `read-only` List of `Person` a person is inspired to follow.

#### `User#chaseNewGoal(g)`
`{User}` `(g) => {Goal}` Adds a new goal a person wants to achieve.

#### `User#forfeitGoal(g)`
`{User}` `(g) => {Goal}` Removes a goal a person was trying to achieve.

#### `User#acceptChallenge(g)`
`{User}` `(g) => {Goal}` Adds a new goal a person was challenged to achieve.

#### `User#forfeitChallenge(g)`
`{User}` `(g) => {Goal}` Removes a goal a person was challenged to achieve.

#### `User#addRoleModel(u)`
`{User}` `(u) => {User}` Marks another user as someone a person is inspired by.

#### `User#removeRoleModel(g)`
`{User}` `(u) => {User}` Un-marks another user as someone a person is inspired by.

## Goal
A `Goal` is an aim or desire a person is chasing for.
A `Goal` has a `Timeline` describing the `Milestone` towards it.
A `Goal` can be reached.

### `Goal` members

#### `Goal#title`
`{String}` `readonly`.

#### `Goal#timeline`
`{Timeline}` `readonly` A {Goal}'s progress indicator.

#### `Goal#isReached`
`{Boolean}` `readonly`.

#### `Goal#reach()`
`{Goal}` Marks a `Goal` as reached.

## Timeline
A `Timeline` is a progress indicator for a given goal.
A `Timeline` has a list of `Milestone` indicating the progress of a goal.

### `Timeline` members

#### `Timeline#milestones`
#### `Timeline#addMilestone(m)`

## Milestone

### `Milestone` members

#### `Milestone#evidence`
#### `Milestone#dateReached`

## Evidence

### `Evidence` members

#### `Evidence#type`
#### `Evidence#title`
#### `Evidence#value`
#### `Evidence#source`
#### `Evidence#description`

<!-- ## User
A `User` is a person that's trying to achieve a goal.

### `User` members

## Timeline
A `Timeline` is a progress indicator towards a goal.
It is composed of a collection of `Milestones` reached at given dates.

### `Timeline` members

#### `Timeline#goal`
`{Goal}` `readonly` Indicates what it is a person is trying to achieve.

#### `Timeline#milestones`
`{Milestone[]}` `readonly` Indicates what milestones a person has reached.

## Goal
A `Goal` is a desire a person wants to achieve.

### `Goal` members

#### `Goal#title`
`{String}` `readonly` What this goal is about.

#### `Goal#isReached`
`{Boolean}` `readonly` Has this goal been reached?

## Milestone
An `Milestone` evidences a person has progressed towards his/her goal.

### `Milestone` members

#### `Milestone#type`
`{String}` `readonly` What kind of evidence this is?
Currently, these are planned to be supported: `text`, `image`, `audio`, `video`.

#### `Milestone#title`
`{String}` An one-liner describing this evidence.

#### `Milestone#source`
`{String}` `readonly` What social network does this evidence come from?
Currently, these are planed to be supported:
  - `html`
  - `text`
  - `imgur:image`
  - `twitter:tweet`
  - `youtube:video`
  - `facebook:post`
  - `facebook:image`
  - `facebook:video`
  - `soundcloud:audio`

#### `Milestone#description`
`{String}` An optional summary of what this achievement is about.

#### `Milestone#value`
`{Mixed}` `readonly` Actual information about evidence, like URLs, text, etc. -->
