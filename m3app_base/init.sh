#! /bin/bash

if [[ "${M3JSDIR}" == "" ]]; then
    echo "arguments error."
    exit 255
fi

if [[ -d "./src" ]]; then
    echo "The applet already exists with this directory. If you confirm to reinitialize, you can delete the 'src' directory and init again."
    exit 254
fi

cp -rf "${M3JSDIR}/m3app_template/." .
cp -f "${M3JSDIR}/m3app_template/.env" .

sed -e 's/"name":[ ]*".*"/"name": "'${m3appname}'"/' -i "" package.json

npm install --save
