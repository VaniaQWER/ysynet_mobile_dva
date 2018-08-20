import { Toast } from 'antd-mobile';
import querystring from 'querystring';
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
    Toast.fail(`请求错误: ${response.status}, ${response.url}`, 1)
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function promiseRequest(url, options) {
  const defaultOptions = {
    credentials: 'include',
    //mode: 'cors',
    method: 'POST',
    'Access-Control-Allow-Credentials': true

  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if(newOptions.type){
      newOptions.headers = {
        Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      ...newOptions.headers,
      };
    }else{
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
    }
    //newOptions.body =  JSON.stringify(newOptions.body);
   newOptions.body = newOptions.type ? querystring.stringify(newOptions.body) : JSON.stringify(newOptions.body);
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      if (error.code) {
        Toast.fail(`请求错误: ${error.name}, ${error.message}`, 1)
      }
      if ('stack' in error && 'message' in error) {
        Toast.fail(`请求错误: ${url}, ${error.message}`, 1);
      }
      return error;
    });
}
