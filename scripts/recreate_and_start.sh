#!/bin/bash
docker compose down
docker image rm riksutin_app
docker compose up
