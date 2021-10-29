/* 
  *  Http Request
  */
const http = require('../axios/http').default;

export function deploy(data){
      
    return new Promise( function (resolve, reject) {
      
      let url = `/monitoring/policy/deploy/conf/${data.policy}`
      
      let fm = new FormData();
      data.hosts.forEach(v=>{
        fm.append('hosts',v);
      });
      fm.append('conf', data.content);

      http.put({
        url: url,
        param: fm
      }).then(res=>{
        resolve(res.data);
      })
        
    })
}

export function undeploy(data){
      
  return new Promise( function (resolve, reject) {
    
    let hosts = data.hosts.map(v=>{ return `hosts=${v}`; }).join("&");
    let url = `/monitoring/policy/undeploy/conf/${data.policy}?${hosts}`
    
    http.delete({
      url: url
    }).then(res=>{
      resolve(res.data);
    })
      
  })
}