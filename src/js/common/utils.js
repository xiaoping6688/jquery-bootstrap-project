/**
 * 工具类
 */
'use strict';

var utils = {
  getUrlQuery: function(url){
    url = url || location.href;
    var query = {}, i, params, param, length;
    if (typeof url === 'string' && url.length) {
      url = url.indexOf('?') >- 1 ? url.replace(/\S*\?/,'') : '';
      params = url.split('&'), length = params.length;

      for (i = 0; i < length; i++) {
        param = params[i].replace(/#\S+/g,'').split('=');
        query[decodeURIComponent(param[0])] = decodeURIComponent(param[1]) || '';
      }
    }

    return query;
  },

  trim: function(str){
    return str.replace(/(^\s*)|(\s*$)/g, '');
  },

　ltrim: function(str){
    return str.replace(/(^\s*)/g, '');
  },

  rtrim: function(str){
    return str.replace(/(\s*$)/g, '');
  },

  removeHtmlTag: function (html) {
   return html.replace(/<[^<>]+?>/g, '');
  },

  HTMLEncode: function (html) {
    var temp = document.createElement('div');
    (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
    var output = temp.innerHTML;
    temp = null;
    return output;
  },

  HTMLDecode: function (text) {
    var temp = document.createElement('div');
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    return output;
  },

  getPageNameByUrl: function(url){
    url = url || '';
    url = url.split('?')[0];
    return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
  },

  getRandomInt: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  isEmail: function(str){
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return reg.test(str);
  },

  isEmpty: function(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
          return false;
      }
    }
    return true;
  },

  isArray: function(arr) {
    return $.isArray(arr);
  },

  isInArray: function(key, value, target) {
    for (var index in target){
      var item = target[index];
      if (item[key] == value){
        return true;
      }
    }

    return false;
  },

  getInArray: function(key, value, target) {
    for (var index in target){
      var item = target[index];
      if (item[key] == value){
        return item;
      }
    }

    return null;
  },

  relativeFormat: function (date) {
    date = new Date(date);

    var seconds, minutes, hours, days;
    var nowTime = new Date().getTime();
    var differ = (nowTime - date.getTime()) / 1000;
    days = Math.round(differ / (24 * 60 * 60));
    hours = Math.round(differ / (60 * 60));
    minutes = Math.round(differ / 60);
    seconds = Math.round(differ);

    if (days > 0 && days < 2) {
      return days + '天前';
    } else if (days <= 0 && hours > 0) {
      return hours + '小时前';
    } else if (hours <= 0 && minutes > 0) {
      return minutes + '分钟前';
    } else if (minutes <= 0 && seconds >= 0) {
      return '刚刚';
    } else {
      return (date.getFullYear() + '-' + this.padZero(date.getMonth() + 1) + '-' + this.padZero(date.getDate()) + ' '+ this.padZero(date.getHours()) + ':'+ this.padZero(date.getMinutes()));
    }
  },

  /**
   * 对日期进行格式化，
   * @param date 要格式化的日期
   * @param format 进行格式化的模式字符串
   *     支持的模式字母有：
   *     y:年,
   *     M:年中的月份(1-12),
   *     d:月份中的天(1-31),
   *     h:小时(0-23),
   *     m:分(0-59),
   *     s:秒(0-59),
   *     S:毫秒(0-999),
   *     q:季度(1-4)
   * @return String
   */
  dateFormat: function (date, format) {
    date = new Date(date);

    var map = {
      'M': date.getMonth() + 1, // 月份
      'd': date.getDate(), // 日
      'h': date.getHours(), // 小时
      'm': date.getMinutes(), // 分
      's': date.getSeconds(), // 秒
      'q': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    };

    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      var v = map[t];
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length);
      }
      return all;
    });

    return format;
  },

  padZero: function (n) {
    if (n % 1 === 0 && n < 10) {
      return '0' + n;
    } else {
      return n;
    }
  },

  getCharLength: function(str){
    var len = 0;
    for (var i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        len += 2;
      } else {
        len += 1;
      }
    }
    return len;
  },

  /**
   * 输入字数限制，返回剩余个数
   */
  inputMaxLimit: function (textField, maxLimit) {
    textField.value = utils.trim(textField.value);

    if(textField.value.length > maxLimit) {
      textField.value = textField.value.substring(0, maxLimit);
      return 0;
    } else {
      return maxLimit - textField.value.length;
    }
  },

  bytesToSize: function (bytes) {
    var units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    var step = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, step), 2) + ' ' + units[step];
  },

  replaceAtToUrl: function (string) {
    stringe = string || '';
    var reg = /@([0-9a-zA-Z\u4e00-\u9fa5_-]+)/g;
    return string.replace(reg, function (content) {
        return '<a class="nickname" href="#">' + content + '</a>';
    });
  },

  bindEvents: function(bindings) {
    for (var i in bindings) {
        var item = bindings[i];
      if (item.selector) {
        $(item.element).off(item.event, item.selector, item.handler);
        $(item.element).on(item.event, item.selector, item.handler);
      } else {
        $(item.element).off(item.event, item.handler);
        $(item.element).on(item.event, item.handler);
      }
    }
  },

  /**
   * 渲染页面模板
   * @param {String} tplId 模板ID
   * @param {Object} renderData 渲染数据
   * @return {String} 返回渲染后的html字符串
   */
  renderById: function(tplId, renderData){
    var markup = $('#' + tplId).html();
    var compiledTemplate = template.compile(markup);
    var output = compiledTemplate(renderData);
    return output;
  },

  /**
   * 渲染远程模板
   * @param {String} tplName 模板名称 (不带后缀tpl,可带目录名如'public/options')
   * @param {Object} renderData 渲染数据
   * @param {Function} callback 回调函数
   */
  renderRemoteTpl: function(tplName, renderData, callback) {
    tplName = tplName || '';
    $.get('html/' + tplName + '.tpl', function(markup) {
      var compiledTemplate = template.compile(markup);
      var output = compiledTemplate(renderData);

      if (typeof(callback) === 'function'){
        callback(output);
      }
    });
  }
};


