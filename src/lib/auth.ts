export function getToken() { return localStorage.getItem("admin_token"); }
export function setToken(t: string) { localStorage.setItem("admin_token", t); }
export function clearToken() { localStorage.removeItem("admin_token"); }
export function isLoggedIn() { return !!getToken(); }
