import { _ } from "core-js";

/* App */
export let appDeploy = async function(data){
      
    return new Promise( await function (resolve, reject) {
      
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


export let appExport = async function(data){
      
    return new Promise( await function (resolve, reject) {
      
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

export let appImport = async function(data){
      
    return new Promise( await function (resolve, reject) {
      
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
