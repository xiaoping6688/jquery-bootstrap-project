/**
 * Ajax请求封装
 */
var ajax = {
  logger: null, // 外部log函数，默认console
  maxRetryTimes: 1, // 最大重试次数
  timeout: 10000, // 请求超时时间（毫秒）
  requestsCache: {},

  /**
   * 发送GET请求
   * @param {String} api 接口URL
   * @param {Object} args 参数
   * @param {Function} onSuccess 成功回调函数
   * @param {Function} onError 失败回调函数
   * @return {jqXHR}
   */
  get: function (api, args, onSuccess, onError) {
    if (this.requestsCache[api]) {
      this.requestsCache[api].ajax.abort();
      delete this.requestsCache[api];
    }

    var request = this.call(api, args, 'GET', onSuccess, onError);
    this.requestsCache[api] = {
      curRetryTimes: 0,
      ajax: request,
      method: 'GET',
      args: args,
      onSuccess: onSuccess,
      onError: onError
    };
    return request;
  },

  /**
   * 发送POST请求
   * @param {String} api
   * @param {Object} args
   * @param {Function} onSuccess
   * @param {Function} onError
   * @return {jqXHR}
   */
  post: function (api, args, onSuccess, onError) {
    if (this.requestsCache[api]) {
      this.requestsCache[api].ajax.abort();
      delete this.requestsCache[api];
    }

    var request = this.call(api, args, 'POST', onSuccess, onError);
    this.requestsCache[api] = {
      curRetryTimes: 0,
      ajax: request,
      method: 'POST',
      args: args,
      onSuccess: onSuccess,
      onError: onError
    };
    return request;
  },

  call: function (api, args, method, onSuccess, onError) {
    ajax.trace('[Request] ' + api + ' method: ' + method + ' args: ' + JSON.stringify(args));

    // 本地测试（假数据）
    if (ENV.BASE_URI === 'mock') {
      method = 'GET';
      for (var key in API) {
        var url = API[key];
        if (api.indexOf(url) == 0) {
          api = url;
          break;
        }
      }
    }

    return $.ajax({
      url: api,
      type: method,
      data: $.isEmptyObject(args) ? null : JSON.stringify(args),
      dataType: 'json',
      async: true,
      contentType: 'application/json',
      timeout: ajax.timeout,
//    cache: true,
      crossDomain: true,
      beforeSend: function(xhr) {
        var token = window.sessionStorage.token
        if (token) {
          xhr.setRequestHeader('token', token);
        }
      },
      success: function(data){
        delete ajax.requestsCache[api];
        ajax.trace('[Response] ' + api + "\n" + JSON.stringify(data));

        if (typeof(onSuccess) === 'function') {
          try {
            onSuccess(data);
          } catch (err) {
            ajax.trace(err, 'error');
          }
        }
      },
      error: function(xhr, status){
        var request = ajax.requestsCache[api];
        if (request && request.curRetryTimes++ < ajax.maxRetryTimes) {
          ajax.trace('[Error] ' + api + ': ' + xhr.status + ' - ' + status + ' retry...' + request.curRetryTimes);
          ajax.call(api, request.args, request.method, request.onSuccess, request.onError);
        } else {
          delete ajax.requestsCache[api];
          ajax.trace('[Error] ' + api + ': ' + xhr.status + ' - ' + status);

          if (typeof(onError) === 'function') {
            onError();
          }
        }
      }
    });
  },

  trace: function (log, level) {
    if (level == undefined) level = 'log';

    if (typeof this.logger === 'function') {
      this.logger(log);
    } else {
      if (ENV.TYPE !== 'production') {
        console[level](log);
      }
    }
  }
};
