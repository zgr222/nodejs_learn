import Cookies from "js-cookie";

export function setToken(token) {
  Cookies.set('STU_ADMIN_TOKEN', token)
}

export function getToken() {
  Cookies.get('STU_ADMIN_TOKEN')
}

export function removeToken() {
  Cookies.remove('STU_ADMIN_TOKEN')
}