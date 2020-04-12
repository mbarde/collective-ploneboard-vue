export function dict2querystr (params) {
  let data = Object.entries(params)
  data = data.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
  let query = data.join('&')
  return query
}

export function extractFirstSentence (text) {
  let firstDotIndex = text.indexOf('. ')
  if (firstDotIndex > -1 && firstDotIndex < text.length - 1) {
    return text.slice(0, firstDotIndex + 1)
  }
  return text
}

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
