
npm publish --access=public --registry=https://registry.npmjs.org/

export over=`grep '"version":\s*".*"' package.json | awk -F '"' '{print $4}'`
export nver=`echo "${over}" | awk -F "." '{print $1"."$2"."$3+1}'`
#echo sed -e 's/"version":[ ]*"'${over}'"/"version": "'${nver}'"/' -i "" package.json
sed -e 's/"version":[ ]*"'${over}'"/"version": "'${nver}'"/' -i "" package.json
#cat package.json
