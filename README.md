
# collective-ploneboard-vue

VueJS Frontend WebApp for https://github.com/collective/collective.ploneboard.

## Setup

### Requirements

Tested with Plone 5.2.1 & plone.restapi 6.1.0

### 1. Backend


* Install [https://github.com/collective/collective.ploneboard](https://github.com/collective/collective.ploneboard#installation)
* Enable addons:
	* collective.ploneboard
	* plone.restapi
* Create new *Message Board* in your Plone site
	* Do not forget to set permissions accordingly: The WebApp will assume that every authenticated user is allowed to create *Conversations* and *Comments*
* Create a *Folder* containing *Pages* with following short names (are loaded from within the WebApp as static pages) & publish those contents:
	* `404`: Your 404 message
	* `footer`: Footer content
	* `login`: Text displayed above login form
	* `welcome`: Content of the welcome page

### 2. Frontend

* Clone this repository
* Edit `utils/constants.js`:
	* `BASE_URL`: Base url of your Plone site
	* `MESSAGE_BOARD_ID`: Id (short name) of the Message Board you created
	* `STATIC_PAGES_PATH`: Id (short name) of the folder containing your static pages
* In `src/assets/` edit:
	* `custom-vars.scss` to customize the used [Bootstrap theme](https://bootstrap-vue.js.org/docs/reference/theming/)
	* `logo.png` and `favicon.ico`
* Run  `npm run build` (or `./rebuild.sh`)
	* Compiled WebApp can then be accessed via: `public/index.html`

## Development

### Basic setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
