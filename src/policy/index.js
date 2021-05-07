
/* 
  *  Http Request
  */
const http = require('../axios/http').default;

async function policyDeploy(data){
      
    return new Promise( await function (resolve, reject) {
      
      let url = `/monitoring/policy/deploy/conf/testconf`
      
      let fm = new FormData();
      data.hosts.forEach(v=>{
        fm.append('hosts',v);
      });
      fm.append('conf', data.policy);

      http.put({
        url: url,
        param: fm
      }).then(res=>{
        resolve(res.data);
      })
        
    })
};

async function policyUndeploy(data){
      
  return new Promise( await function (resolve, reject) {
    
    let hosts = data.hosts.map(v=>{ return `hosts=${v}`; }).join("&");
    let url = `/monitoring/policy/undeploy/conf/${data.policy}?${hosts}`
    
    http.delete({
      url: url
    }).then(res=>{
      resolve(res.data);
    })
      
  })
}; 