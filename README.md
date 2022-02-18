# node-sample-mongodb

![workflow](https://github.com/leonardofurnielis/node-sample-mongodb/actions/workflows/test-coverage.yml/badge.svg)
[![codecov](https://codecov.io/gh/leonardofurnielis/node-sample-mongodb/branch/master/graph/badge.svg?token=3OQBM9XRVO)](https://codecov.io/gh/leonardofurnielis/node-sample-mongodb)

## Table of Contents

- [Local](#local)
- [Docker](#docker)

## Local

To run this code in your computer execute the following commands into project root directory

```bash
$ npm install
$ npm start
```

## Docker

To run this code using Docker container execute the following commands into project root directory

```bash
$ docker build -t node-sample-mongodb .
$ docker run -p 8080:3000 -d node-sample-mongodb
```
