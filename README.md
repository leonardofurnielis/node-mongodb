![workflow](https://github.com/leonardofurnielis/node-mongodb/actions/workflows/build-test.yml/badge.svg)
[![codecov](https://codecov.io/gh/leonardofurnielis/node-mongodb/branch/master/graph/badge.svg?token=3OQBM9XRVO)](https://codecov.io/gh/leonardofurnielis/node-mongodb)

## Table of Contents

- Developing locally
  - [Native runtime](#native-runtime)
  - [Containerized](#containerized)

## Native runtime 

To run this code in your computer execute the following commands into project root directory

```bash
npm install
npm start
```

## Containerized

To run this code using Docker container execute the following commands into project root directory

```bash
docker build -t node-mongodb .
docker run -p 8080:3000 -d node-mongodb
```
