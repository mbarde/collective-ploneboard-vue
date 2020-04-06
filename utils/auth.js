import decode from 'jwt-decode'

import { LS_KEY_TOKEN, LS_KEY_USERNAME, LS_KEY_USERID, LS_KEY_USER_IS_ADMIN } from './constants'

export function getToken () {
  return localStorage.getItem(LS_KEY_TOKEN);
}

export function logout () {
  localStorage.clear()
}

// Get and store access_token in local storage
export function setToken (accessToken) {
  localStorage.setItem(LS_KEY_TOKEN, accessToken)
}

export function isLoggedIn () {
  const token = getToken()
  return token && !isTokenExpired(token)
}

export function setUsername (username) {
  localStorage.setItem(LS_KEY_USERNAME, username)
}

export function getUsername () {
  return localStorage.getItem(LS_KEY_USERNAME)
}

export function setUserId (userid) {
  localStorage.setItem(LS_KEY_USERID, userid)
}

export function getUserId () {
  return localStorage.getItem(LS_KEY_USERID)
}

export function setUserIsAdmin (isAdmin) {
  if (isAdmin) {
    localStorage.setItem(LS_KEY_USER_IS_ADMIN, true)
  } else {
    localStorage.removeItem(LS_KEY_USER_IS_ADMIN)
  }
}

export function isUserAdmin () {
  var isAdmin = localStorage.getItem(LS_KEY_USER_IS_ADMIN)
  return (isAdmin === 'true')
}

function getTokenExpirationDate (encodedToken) {
  const token = decode(encodedToken)
  if (!token.exp) { return null }

  const date = new Date(0)
  date.setUTCSeconds(token.exp)

  return date
}

function isTokenExpired (token) {
  const expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}
