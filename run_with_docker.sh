#!/usr/bin/env bash
docker build -t s8-fd-ui .
docker run -p 3000:3000 s8-fd-ui