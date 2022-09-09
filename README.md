# node-bootstrap-mongodb

![workflow](https://github.com/leonardofurnielis/node-bootstrap-mongodb/actions/workflows/test-coverage.yml/badge.svg)
[![codecov](https://codecov.io/gh/leonardofurnielis/node-bootstrap-mongodb/branch/master/graph/badge.svg?token=3OQBM9XRVO)](https://codecov.io/gh/leonardofurnielis/node-bootstrap-mongodb)

## Table of Contents

- Developing locally
  - [Native runtime](#native-runtime)
  - [Docker](#docker)

## Native runtime 

To run this code in your computer execute the following commands into project root directory

```bash
$ sh generating-rsa-key.sh
$ npm install
$ npm start
```

## Docker

To run this code using Docker container execute the following commands into project root directory

```bash
$ sh generating-rsa-key.sh
$ docker build -t node-bootstrap-mongodb .
$ docker run -p 8080:3000 -d node-bootstrap-mongodb
```
