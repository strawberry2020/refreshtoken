import request from "./request";
import { getRefreshToken } from "./token";

let promise;

// 复用刷新token的promise
export async function refreshToken() {
  if (promise) return promise;
  promise = new Promise(async (resolve) => {
    request
      .get("/refresh_token", {
        headers: {
          Authorization: `Bearer ${getRefreshToken()}`,
        },
        __isRefreshToken: true,
      })
      .then((res) => {
        resolve(true);
      })
      .catch((err) => {
        resolve(false);
      });
  });
  promise.finally(() => {
    promise = null;
  });
  return promise;
}

export function isRefreshRequest(config) {
  return !!config.__isRefreshToken;
}

// 并发调用时会多次刷新token
// import request from "./request";
// import { getRefreshToken } from "./token";

// export async function refreshToken() {
//   const resp = request
//     .get("/refresh_token", {
//       headers: {
//         Authorization: `Bearer ${getRefreshToken()}`,
//       },
//       __isRefreshToken: true,
//     })
//     .then((res) => {
//       return true;
//     }).catch((err) => {
//         return false
//       });
//   return resp;
// }

// export function isRefreshRequest(config) {
//   return !!config.__isRefreshToken;
// }
