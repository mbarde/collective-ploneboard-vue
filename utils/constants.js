module.exports = {

  /* [installation specific constants] */
  /* whether to auto format plain text links
     as clickable html links: */
  AUTO_FORMAT_LINKS: true,
  BASE_URL: 'https://cms8.uni-koblenz.de/ErstiForum',
  MESSAGE_BOARD_ID: 'forum',
  STATIC_PAGES_PATH: '/pages',
  /* maxiumum character count of
  / description texts in overviews: */
  MAX_DESCRIPTION_LENGTH: 150,

  /* [localStorage keys] */
  LS_KEY_TOKEN: 'token',
  LS_KEY_USERID: 'userid',
  LS_KEY_USERNAME: 'username',
  LS_KEY_USER_IS_ADMIN: 'userIsAdmin',

  /* [sessionStorage keys] */
  SESS_PREFIX_CACHED: 'cached_',
  SESS_GOTO_AFTER_LOGIN: 'redirectto',
}
