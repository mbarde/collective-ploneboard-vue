export function mail2userid (mail) {
  return mail.split('@')[0]
}

export function nl2br (str) {
  var breakTag = '<br/>'
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2')
}

export function url2id (url) {
  return url.split('/').pop()
}
