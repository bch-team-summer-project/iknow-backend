# iknow-backend

iknow summer project Node js backend
This is a backend exposing API endpoints
/events that returns the list of events happening in Helsinki

/activities that returns the list of activities that you can do in Helsinki

/newevent - crud api, able to create, update, delete, show list of added events

/lost - crud api able to create, update, delete, show list of added lost&&found items

/weather - cors api, that returns weather temperature and descriptuion of weather in Helsinki, Espoo, Vantaa

/beachTemp - cors api, that returns water temperture in different beaches

The data for these endpoints is coming from Helsinki open API
[Event Data](http://open-api.myhelsinki.fi/v1/events/?language_filter=en&limit=20)
[Activities Data](http://open-api.myhelsinki.fi/v1/activities/?language_filter=en&limit=5)

# How to install this project

```bash
npm install
npm install moment --save

# How to use this project

npm start


```

### Authors and acknowledgment:

### Ankita Bhatnagar [GitHub](https://github.com/ankita-projects)

### Julia Matvi: [GitHub](https://github.com/jualiasha), [LinkedIn](www.linkedin.com/in/jualiasha)
