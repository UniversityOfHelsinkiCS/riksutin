# Riksutin [![Release](https://github.com/UniversityOfHelsinkiCS/riksutin/actions/workflows/production.yml/badge.svg)](https://github.com/UniversityOfHelsinkiCS/riksutin/actions/workflows/production.yml) [![Release](https://github.com/UniversityOfHelsinkiCS/riksutin/actions/workflows/staging.yml/badge.svg)](https://github.com/UniversityOfHelsinkiCS/riksutin/actions)

Riksutin (officially known as **Risk-i** or **International collaboration risk assessment application**) is a tool created for researchers and staff of University of Helsinki who are planning a project that includes collaboration with organisations, such as universities, from other countries.

## Development

- Install npm, docker and docker compose
- Clone the repository
- Copy `.env.template` as `.env` file and fill in the required values
- Run `npm i` and `npm start` to setup and start the development environment

## Running tests locally (and in CI)

Start app with `npm run start:local:test`, wait until the frontend is build and app is served in [http://localhost:3000/](http://localhost:3000/).

Run tests with `npm run test:local`. You get the UI mode with params `-- --ui`.

The envs for testing are in `cienv`

Envs are using a dummy service to mock the external dependencies, see [data_source_mock](https://github.com/UniversityOfHelsinkiCS/riksutin/tree/master/data_source_mock). Data is mostly hardcoded so you will not get, e.g., real universities of each country.

By default the caching of data sources is turned off when tests are run, see [this](https://github.com/UniversityOfHelsinkiCS/riksutin/blob/master/cienv#L7)

## Features

### Survey

The main part of the app is a form that includes multiple questions about the project. [Docs](./docs/Survey.md) include a more detailed explanation.

### Risk calculation

After sending the entry to backend, the app calculates different risk levels for the project. The risks are based on the form and the data for calculating risks is either fetched from different external data sources or from `data/results.ts`. More information on the algorithm is found in the [docs](./docs/Algorithm.md).

### Results

The results page contains the risks in a table format which contains three columns: name, level and info text. The list of answers to the form is found below the table.

### User page

The user page contains a summary of the user's entries.

### Admin page

Four tabs can be found in the admin page:

- **Summary**: this tab contains a table of all the entries. The table can be exported as .xlsx file.
- **Edit survey**: here the admin can edit general survey texts and order of the questions.
- **Edit questions**: as the name suggests, this tab is for editing question titles and info texts.
- **Edit results**: here the admin can edit the result titles and info texts.
