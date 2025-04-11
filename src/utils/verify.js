function verifyMobile(rules, value, callback) {
  if (!value) {
    callback(new Error("请输入手机号！"));
  }
  const regExp = /^1(3|4|5|6|7|8|9)\d{9}$/;
  if (!regExp.test(value)) {
    return callback(new Error("手机号验证失败!"));
  }
  callback();
}

function verifyEmail(rules, value, callback) {
  if (!value) {
    callback(new Error("请输入邮箱！"));
  }
  const regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!regExp.test(value)) {
    return callback(new Error("邮箱验证失败!"));
  }
  callback();
}

function verifyIdCard(rules, value, callback) {
  if (!value) {
    return false;
  }
  const regExp = /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!regExp.test(value)) {
    return callback(new Error("身份证验证失败！"));
  }
  callback();
}

export { verifyMobile, verifyEmail, verifyIdCard };
