$('#loginBtn').click(function () {
  var username = $("#username").val().trim();
  var password = $("#password").val().trim();
  if (!username || !password) {
//  alert('账号或密码不能为空');
    return;
  }

  var stateBtn = $(this).button('loading');

  var args = {
    phone: username,
    password: CryptoJS.MD5(password).toString()
  };

  ajax.post(API.LOGIN, args, function (response) {
    stateBtn.button('reset');

    if (!response) {
      alert('数据异常');
      return;
    }

    if (response.rlt == 'true') {
      if (!response.data) {
        alert('数据异常');
        return;
      }

      window.sessionStorage.user = JSON.stringify(response.data);
      window.sessionStorage.token = response.data.token;
      window.location.href = 'main.html';
    } else {
      alert(response.message);
    }
  }, function () {
    stateBtn.button('reset');
  });
});
