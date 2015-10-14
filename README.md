# prince-bookmarklet
Converts webpages to PDF with PrinceXML and pushes it to WebDAV


## Environment Variables

`WEBDAV_USERNAME`
`WEBDAV_PASSWORD`
`WEBDAV_URL`




## Deployment on Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/darvin/prince-bookmarklet)


```bash
heroku config:set WEBDAV_URL=https://dav.box.com/dav/FromBrowser/
heroku config:set WEBDAV_USERNAME=yourbox@email.com
heroku config:set WEBDAV_PASSWORD=yourboxpassword
```