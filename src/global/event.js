/* 告警视图结构 */
export let EventViewDataObj = {
    info:{
      name: "新建视图",
      desc: ""  
    },
    datasource: {
      name: "数据源",
      class: "",
      fields: {},
      filter: ""
    },
    view: {
      columns: []
    }
  };

export let EventViewTools = {
  "url": {
    "id": null,
    "name": "",
    "icon": "",
    "type":"url",
    "url":{
        "value": "",
        "target": "_blank"
    }
  },
  "component": {
    "id": null,
    "name": "",
    "icon": "",
    "type":"component",
    "component":{
        "name": ""
    }
  },
  "divider": null,
  "action": {
    "id": null,
    "name": "",
    "icon": "",
    "type": "action",
    "action": {
        "name":"",
        "value": null
    }
  },
  "attachment": {
    "id": null,
    "name": "",
    "icon": "",
    "type":"attachment"
  },
  "tags": {
    "id": null,
    "name": "", 
    "icon": "",
    "type": "tags"
  },
  "dir": {
    "name": ""
  }
};