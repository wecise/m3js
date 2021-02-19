(function(res) {
	if (typeof module !== "undefined") {
		module.exports = res;
	}
	return res;
})(
(function(global) {
  'use strict';
  // m3js/src/index.js
  var ___R$m3js$src$index_js = {};
/**
 * Copyright (c) 2020, Wecise
 * All rights reserved.
 */

	(function(global, factory) {
		typeof ___R$m3js$src$index_js === "object" && typeof module !== "undefined"
			? factory(___R$m3js$src$index_js)
			: typeof define === "function" && define.amd
				? define(["exports"], factory)
				: factory(global.m3 = global.m3 || {});
	})(
		this,
		function(exports) {
			"use strict";
			let version = "1.0.0";

			/**
   * **Note:** This method mutates `object`.
   *
   * @static
   * @memberOf _
   * @since 1.0.0
   * @category 
   * @param 
   * @returns 
   * @example
   *
   */

			/* 
   *  sessionid for M3 platform
  */
			let baseUrl = "";
			let sessionid = "";

			function ajax(opts) {
				let _url = "";

				if (opts.url.indexOf("http://") === -1) {
					_url = "" + baseUrl + opts.url + "&sessionid=" + sessionid;
				} else {
					_url = opts.url;
				}

				var xhr = new XMLHttpRequest();
				var type = opts.type || "GET";
				let url = _url;
				//var params = opts.data;
				let dataType = opts.dataType || "json";
				type = type.toUpperCase();

				if (type === "GET") {
					params = function(obj) {
						let str = "";

						for (let prop in obj) {
							str += prop + "=" + obj[prop] + "&";
						}
						str = str.slice(0, str.length - 1);
						return str;
					}(opts.data);
					url += url.indexOf("?") === -1 ? "?" + params : "&" + params;
				}

				xhr.open(type, url);

				if (opts.contentType) {
					xhr.setRequestHeader("Content-type", opts.contentType);
				}

				xhr.send(params ? params : null);

				//return promise
				return new Promise(function(resolve, reject) {
					//onload are executed just after the sync request is comple，
					//please use 'onreadystatechange' if need support IE9-
					xhr.onload = function() {
						if (xhr.status === 200) {
							var result;
							try {
								result = JSON.parse(xhr.response);
							} catch (e) {
								result = xhr.response;
							}
							resolve(result);
						} else {
							reject(xhr.response);
						}
					};
				});
			}
			/* 
   *  connect to M3 platform and return sessionid 
  */
			let connect = async function(url, port, company, username, password) {
				baseUrl = "http://" + [url, port].join(":");
				let opts = {
					url: baseUrl +
					"/user/signin?company=" +
					company +
					"&username=" +
					username +
					"&password=" +
					password,
					type: "post",
				};
				await ajax(opts).then((rtn) => {
					sessionid = rtn.message;
					globalHandler();
				}).catch((err) => {
					console.log(err);
				});
			};

			/* 
   *  Get global register info for M3 platform
   */
			let globalHandler = async function() {
				await callFS("/matrix/utils/global.js", null).then((rtn) => {
					exports.global = rtn.message;
				});
			};

			/* 
   *  Get global register info by username for M3 platform
   */
			// let globalByUserHandler = function(parent, name) {
			// 	let opts = {url: `/fs${parent}/${name}&type=file`};
			// 	ajax(opts).then((rtn) => {
			// 		globalByUser = rtn;
			// 	}).catch((err) => {
			// 		globalByUser = err;
			// 	});
			// };

			/* 
   *  Call a serverJS interface for M3 platform
   */
			let callFS = async function(fileName, input) {
				let opts = {
					url: "/script/exec/js?filepath=" +
					fileName +
					"&input=" +
					input +
					"&isfile=true",
				};
				let rt = null;
				await ajax(opts).then((rtn) => {
					rt = rtn;
				}).catch((err) => {
					rt = err;
				});

				return rt;
			};

			// let topBar = function() {};

			// let leftBar = function() {};

			// let rightBar = function() {};

			// let footBar = function() {};

			exports.sessionid = sessionid;
			exports.version = version;
			exports.connect = connect;
			exports.callFS = callFS;

			Object.defineProperty(exports, "__esModule", {value: true});
		},
	);


  return ___R$m3js$src$index_js;
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this));
//# sourceMappingURL=index.js.map