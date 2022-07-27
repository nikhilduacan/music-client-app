# :rocket: Challenge - Validus Music Database 
This repo contains the music-service and the UI Test.docx file with instructions on what needs to be done.  The information below describes how to get the music-service running.

:stopwatch: ***This challenge should take no more than 1 hour to complete.***

:exploding_head: Try to keep it simple, don't make it complex in terms of interface and design

# Dependencies
- Docker Desktop
- VSCode or similar Text Editor

# Preferred Stack and Design Patterns
- ***In case of Angular 9+***
    - TypeScript / ECMAScript 6+
    - RXJS Observables 
    - MVVM Architecture 
    - Karma Testing
    - Angular Routing

- ***In case of Vue***
    - TypeScript / ECMAScript 6+
    - Pinia State Management (Redux)
    - MVVM Architecture 
    - Vitest / Cypress for testing
    - Vue.js Router


# Instructions
1) Clone this repo.
2) start the server:
    $ cd music-service
    $ docker-compose up
4) Test the service
    $ curl localhost:5000/albums

To stop service:
    $ CTRL-C
    $ docker-compose down

NOTE: the music-service has 3 endpoints and runs on port 5000:
http://localhost:5000/albums
http://localhost:5000/artists
http://localhost:5000/songs

Each of these endpoints supports pagination, sorting and filtering

Filter
Use . to access deep properties

GET /posts?title=json-server&author=typicode
GET /posts?id=1&id=2
GET /comments?author.name=typicode

Paginate
Use _page and optionally _limit to paginate returned data.

In the Link header you'll get first, prev, next and last links.

GET /posts?_page=7
GET /posts?_page=7&_limit=20
10 items are returned by default

Sort
Add _sort and _order (ascending order by default)

GET /posts?_sort=views&_order=asc
GET /posts/1/comments?_sort=votes&_order=asc
For multiple fields, use the following format:

GET /posts?_sort=user,views&_order=desc,asc


***** NOTE: Push your changes to your own github repo (NOT THIS ONE!) and send back the uri. *****
