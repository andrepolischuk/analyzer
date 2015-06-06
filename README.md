# analyzer

  > Client-side user data tracker

  * URL parameters
  * cookies
  * search query
  * referer URL
  * browser parameters
  * OS parameters
  * timezone

## Install

```sh
npm install --save analyzer
```

```sh
component install andrepolischuk/analyzer
```

## Usage

```js
  var anl = analyzer(options[, callback]);
```

### options.path

  Set path for sending request data.
  If path is not set, data is not sent.

### options.sid

  Set site ID

### callback

  Set callback for push data request

## API

### analyzer.push([callback])

  Research user data and send again with callback,
  which will be called instead of analyzer global callback.

```js
analyzer.push(function(req) {

});
```

  `req` is user data array aggregated by analyzer

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

## License

  MIT
