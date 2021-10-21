#! /bin/bash

export m3appname=`pwd | sed "s/.*\///"`

if [[ "${m3appname}" == "m3js" ]]; then
    echo
    echo "M3Applet can't named '"${m3appname}"'."
    echo
    exit 255
fi

if [[ $# == 0 ]]; then
    echo
    echo 'Usage:
    ./node_modules/@wecise/m3js/cmd init 根据M3JS提供的模版初始化工程目录
    '
    exit 0
fi

export cmd=$1

export M3JSDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

"${M3JSDIR}/m3app_base/${cmd}.sh"
