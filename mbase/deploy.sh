#! /bin/bash
set -euo

hostTerm=$1
company=$2
username=$3
password=$4
target="$5.zip"
title=$6
version=$7
file_size=$(ls -l "$target" | awk '{print $5}')

auth="$company.$username:$password"
hostPreFix="http://"
host=""
dfs="/app/matrix/$5"

# AppStore
fileName="/matrix/m3appstore/appStoreAuto.js"
fileForm="input={\"action\": \"c\",\"param\":{ \"name\": \"$target\", \"title\": \"$title\", \"version\": \"$version\", \"author\": \"wecise\", \"dfs\": \"$dfs\", \"size\": \"$file_size\" }}"

if [[ $hostTerm =~ $hostPreFix ]] 
then
    host=$hostTerm
else
    host="http://$hostTerm"
fi

echo
echo '应用发布开始**********************************************************************'
echo
echo '发布地址：'${host}
echo
echo '发布租户：'${company}
echo

echo "应用上传"
curl --location -u "${auth}" -X POST "$host/fs/import?depth=3&issys=true" --form "uploadfile=@${target}" | python -m json.tool

echo "应用配置"
curl -u "${auth}" -X POST "$host/script/exec/js?filepath=${fileName}"  -F "${fileForm}" -F "isfile=true" | python -m json.tool

echo
rm -rf ${target}
echo '应用发布结束**********************************************************************';
