export function url2id (url) {
  return url.split('/').pop()
}

export function nl2br(str) {
  var breakTag = '<br/>'
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
}
