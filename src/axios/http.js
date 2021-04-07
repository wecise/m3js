const axios = require('./axios.min.js');
//const qs = require('./qs.min.js');

// 创建axios实例
const service = axios.create({
  baseURL: 'http://47.92.151.165:8080',
  //baseURL: 'http://18.188.85.82:8080',
  timeout: 5000,
  responseType: 'json'
});

//请求拦截器
service.interceptors.request.use(config => {
  
  config.headers = {
		'Content-Type': 'application/json'
	}

  if(window.sessionid){
    if(config.url.indexOf("?") === -1){
      config.url += `?sessionid=${window.sessionid}`;
    } else {
      config.url += `&sessionid=${window.sessionid}`;
    }
  }

  

  // 配置token
	// if(token){
	//   config.token = {'token':token}
	// }
  
	return config
}, error => {
	return Promise.reject(error)
})
 
//响应拦截器即异常处理
service.interceptors.response.use(response => {
    
    /* if(response.data.status == 'siginin'){
      window.location.href = "/user/login";
    } */

    return response;

}, err => {

	if(err && err.response) {
		switch(err.response.status) {
			case 400:
				err.message = '错误请求'
				break;
			case 401:
				err.message = '未授权，请重新登录'
				break;
			case 403:
				err.message = '拒绝访问'
				break;
			case 404:
				err.message = '请求错误,未找到该资源'
				break;
			case 405:
				err.message = '请求方法未允许'
				break;
			case 408:
				err.message = '请求超时'
				break;
			case 500:
				err.message = '服务器端出错'
				break;
			case 501:
				err.message = '网络未实现'
				break;
			case 502:
				err.message = '网络错误'
				break;
			case 503:
				err.message = '服务不可用'
				break;
			case 504:
				err.message = '网络超时'
				break;
			case 505:
				err.message = 'http版本不支持该请求'
				break;
			default:
				err.message = `连接错误${err.response.status}`
		}
	} else {
		err.message = "连接到服务器失败"
	}
	// window.location.href="error.html";
  console.log("error",err)
  
	return Promise.reject(err.response);
})

export default {
	// get请求
  get (evt) {
    return new Promise((resolve, reject) => {
      service.get(evt.url,{params:evt.param})
      	.then(res => {
         resolve(res)
      }, err => {
          reject(err)
      })
    })
  },
  // post请求
  post (evt) {
    
    return new Promise((resolve, reject) => {
      service.post(
        evt.url,
        evt.param,
        evt.config?evt.config:null
      ).then(res => {
        resolve(res)
      }, err => {
          reject(err)
      })
    })
  },
  // put请求
  put (evt) {
    return new Promise((resolve, reject) => {
      service.put(evt.url, evt.param)
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        })
    })
  },
  // delete
  delete (evt){
  	return new Promise((resolve, reject) => {
      service.delete(evt.url, evt.param)
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        })
    })
  }

}