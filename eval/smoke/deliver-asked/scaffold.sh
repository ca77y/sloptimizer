#!/bin/sh
# Builds this case's project: the shared fixture, with this folder's seed/ on top when it has one.
exec sh "$(dirname "$0")/../fixture.sh" "$(cd "$(dirname "$0")" && pwd)"
