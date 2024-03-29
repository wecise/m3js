
//import { axios } from "./axios.min.js";
import axios from 'axios';
//const qs = require('./qs.min.js');

// 创建axios实例
const service = axios.create({
  baseURL: window.location.origin,
  timeout: 60000 * 10,
  responseType: 'json'
});

//请求拦截器
service.interceptors.request.use(config => {
  if(window.loaded) {
    //页面加载渲染完成后，timePhase记录每次请求的发起时间
    window.timePhase=Date.now();
  }

  config.headers = {
		'Content-Type': 'application/json;charset=utf-8',
	}

  if(config.data && config.data.responseType){
    config.responseType = config.data.responseType;
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
  
	return config;
}, error => {
	return Promise.reject(error)
})
 
//响应拦截器即异常处理
service.interceptors.response.use(response => {
    
    if(response.data && response.data.status == 'signin'){
      window.location.href = "/user/login";
    }
    console.debug("[MHR]",response)
  
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
				err.message = `连接错误 ${err.response.status}`
		}
	} else {
		err.message = "连接到服务器失败"
	}
	// window.location.href="error.html";
	return Promise.reject(err.response);
})

export default {
	// get请求
  get (evt) {
    return new Promise((resolve, reject) => {
      try {
        service.get(evt.url, evt.param?{params: evt.param}:null )
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        }).catch(err => {
          reject(err)
        })
      }catch(err){
        reject(err)
      }
    })
  },
  // post请求
  post (evt) {
    return new Promise((resolve, reject) => {
      try {
        service.post(
          evt.url,
          evt.param
        ).then(response => {
          resolve(response)
        }, err => {
          reject(err)
        }).catch(err => {
          reject(err)
        })
      }catch(err){
        reject(err)
      }
    })
  },
  // put请求
  put (evt) {
    return new Promise((resolve, reject) => {
      try {
        service.put(evt.url, evt.param)
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        }).catch(err => {
          reject(err)
        })
      }catch(err){
        reject(err)
      }
    })
  },
  // delete
  delete (evt){
    return new Promise((resolve, reject) => {
      try {
        service.delete(evt.url, evt.param)
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        }).catch(err => {
          reject(err)
        })
      }catch(err){
        reject(err)
      }
    })
  }
}
