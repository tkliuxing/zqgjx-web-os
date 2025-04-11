export const APP_ID = "";

export function wx_token(uri) {
  return "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APP_ID + "&redirect_uri=" + uri + "&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
}