/*
 * 通用工具功能
 * 前端开发中常用的有一定的工具性质的功能函数，
 */

import jsf from "./jsFormat.js"
import hf from "./htmlFormat.js"
import mu from "./mu.js"

export let jsFormat = jsf.jsFormat
export let htmlFormat = hf.htmlFormat
export let merge = mu.merge
export let loadCSS = mu.loadCSS
export let loadJS = mu.loadJS
export let bytesSize = mu.bytesSize
export let adjustColor = mu.adjustColor
export let copyToClipboard = mu.copyToClipboard
export let formatDuration = mu.formatDuration
export let detectDeviceType = mu.detectDeviceType
