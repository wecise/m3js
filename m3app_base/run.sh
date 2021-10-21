#! /bin/bash

if [[ "${M3JSDIR}" == "" ]]; then
    echo "arguments error."
    exit 255
fi

npm run serve
