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

<script src="/static/js/ghost.min.js"></script>
<script>
  var gh = ghost({
    path : 'BACKEND_PATH',
    sid  : 'SITE_ID'
  });
</script>
```

### path

  Set path for sending request data

### sid

  Set site ID

### uid

  Set user ID

## API
  
### ghost.push()

  Research user data and send again

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