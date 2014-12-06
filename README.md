# Ghost

  Client-side user data tracker

* URL parameters
* cookies
* search query
* referer URL
* browser parameters
* OS parameters
* timezone

## Instalation

  Via script tag in page sources:

```html
<script src="//cdn.rawgit.com/andrepolischuk/ghost/1.0.0/ghost.min.js"></script>
```

```js
  var gh = ghost(options[, callback]);
```

### options.path

  Set path for sending request data.
  If path is not set, data is not sent.

### options.sid

  Set site ID

### callback

  Set callback for push data request

## API

### ghost.push([callback])

  Research user data and send again with callback,
  which will be called instead of ghost global callback.

```js
ghost.push(function(req) {

});
```

  `req` is user data array aggregated by ghost

## Request

  Tracker send GET request to defined path

### sid

  Site ID

### uid

  User ID

### pageUrl

  Current page URL

### pageRef

  Referer page URL

### pageVars

  Campaign parameters array (utm)

### pageQ

  Search query

### pageCc

  Page cookies

### appName

  Browser name

### appVers

  Browser version

### appLang

  Browser language

### osName

  OS name

### osVers

  OS version

### t

  User date and time, example 17.01.2013 17:34

### tz

  User timezone, example UTC 7

### screen

  User screen resolution
