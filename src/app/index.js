
import http from "../axios/http"

/* App */
export let deployApp = function(data){
      
    return new Promise( function (resolve, reject) {
      
        let url = `/fs/import${window.auth.isAdmin?'?issys=true':''}`
        let fm = new FormData();
        fm.append("uploadfile", data);

        http.get({
            url: url,
            param: fm
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
        
    })
};


export let exportApp = function(data){
      
    return new Promise( function (resolve, reject) {
      
        let classStr = data.class.join("&class=");
        let url = `/app/export?name=${data.name}&dir=${data.dir}&version=${data.version}${classStr}`;
        
        http.get({
            url: url
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
        
    })
};

export let importApp = function(data){
      
    return new Promise( function (resolve, reject) {
      
        let url = `/app/import`;
        let fm = new FormData();
        fm.append("uploadfile", data.files[0], data.name);

        http.post({
            url: url,
            param: fm
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
        
    })
};

export let packApp = function(data){
      
    return new Promise( function (resolve, reject) {
      
        let url = `/app/pack`;
        let fm = new FormData();
        fm.append("uploadfile", data.uploadfile);
        fm.append("name", data.name);
        fm.append("version", data.version);
        fm.append("dir", data.dir);
        
        if(!_.isEmpty(data.file)){
            data.file.forEach(v=>{
                fm.append("file", v);
            })
        }
        if(!_.isEmpty(data.rule)){
            data.rule.forEach(v=>{
                fm.append("rule", v);
            })
        }
        if(!_.isEmpty(data.job)){
            data.job.forEach(v=>{
                fm.append("job", v);
            })
        }
        if(!_.isEmpty(data.class)){
            data.class.forEach(v=>{
                fm.append("class", v);
            })
        }
        http.post({
            url: url,
            param: fm
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
        
    })
};


export let unPackApp = function(data){
      
    return new Promise( function (resolve, reject) {
      
        let url = `/app/unpack`;
        let fm = new FormData();
        fm.append("filepath", data.filepath);
        http.post({
            url: url,
            param: fm
        }).then(res=>{
            resolve(res.data);
        }).catch(err=>{
            reject(err);
        })
        
    })
};