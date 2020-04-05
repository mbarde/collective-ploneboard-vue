import axios from 'axios'
import { getToken, setToken } from './auth'
import { SESS_PREFIX_CACHED } from './constants'

const BASE_URL = 'http://cms6.uni-koblenz.de:4050/ErstiForum'

export { login,
         getContent, updateContent, deleteContent,
         workflowAction }

function pathToURL (path) {
  var url = ''
  if (path.indexOf(BASE_URL) === 0) {
    url = path
  } else {
    url = `${BASE_URL}` + path
  }
  return url;
}

function login (username, password) {
  const url = `${BASE_URL}` + '/@login'
  return axios.post(url,
									{'login': username, 'password': password},
									{ headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}}
        ).then(
          (response) => { setToken(response.data.token); return 200 },
          (error) => error.response.status
        )
}

function getContent (path, allowCaching = false) {
  var url = pathToURL(path)
  if (allowCaching) {
    var cached = sessionStorage.getItem(`${SESS_PREFIX_CACHED}${url}`)
    if (cached) {
      try {
        var cachedObject = JSON.parse(cached)
        return new Promise((resolve) => {
          resolve(cachedObject)
        })
      } catch (e) {
        sessionStorage.removeItem(`${SESS_PREFIX_CACHED}${url}`)
        throw e
      }
    }
  }
  return axios.get(url, { headers: {'Accept': 'application/json', Authorization: `Bearer ${getToken()}` } })
              .then(
                (response) => {
                  if (allowCaching) {
                    try {
                      sessionStorage.setItem(`${SESS_PREFIX_CACHED}${url}`, JSON.stringify(response.data))
                    } catch(e) {
                      if (e.code == 22) {
                        console.warn('Session storage full: Could not cache item')
                      } else {
                        console.error(e);
                      }
                    }
                  }
                  return response.data
                },
                (error) => error
              )
}

function updateContent (path, data) {
  return axios.patch(pathToURL(path), data,
									{ headers: {'Accept': 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` } })
				.then(response => response)
}

function deleteContent (path) {
  return axios.delete(pathToURL(path),
									{ headers: {'Accept': 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` } })
				.then(response => response)
}

function workflowAction (path, action) {
return axios.post(pathToURL(path) + '/@workflow/' + action, {},
                { headers: {'Accept': 'application/json', Authorization: `Bearer ${getToken()}` } })
      .then(response => response.data)
}
