# POSTS APP

This repository contains files to practice with a server setup for posts app based on NodeGirls' resources.

# Let's get started!

```
npm init -y
npm add express
npm add -D nodemon
```

## Import the Express module

```javascript
const express = require('express');
```

## Create the server object

```javascript
const express = require('express');
const app = express();
```

## Start our server “listening”

The listen() function takes two arguments: a port number and a callback function.

```javascript
app.listen(8080, () => {
  console.log('Server has started listening on port 8080.');
});
```

## Talk to the server

Our Express app object, which is our server, is listening for requests, but how will it know which requests to respond to and what to do when it does?

To do this Express keeps a list of items called ‘routes’.

Each route has three components:

- HTTP request method
- URL path (AKA endpoint)
- handler function

_When the server receives a request, it looks at the request’s URL path and request method. If it has a route that matches both, then it responds to the request by running the handler function associated with the matching route._

This process of matching a request to the right handler function is called “routing”.

We add routes to our server to tell it which requests to respond to, and what to do for the response in each case.

## Add a Route

To add a route using Express, you call the function for the request method, using the URL and **your handler function (A function that receives requests and tells the server how to respond to them.**) as parameters.

```javascript
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});
```

### - Request contains all the information about the request that matched this route.

### - Response is what we use to send a response back to the client. i.e. response.send()

### - send(): The Express method used to send information back to the client from the server. Updates the response object.

## Serve static files

Express provides a middleware function to handle this situation: express.static(). Middleware functions are like special handler functions that run on every request before our routes are processed.

## Serve our static assets(Files such as HTML, CSS and JavaScript documents or images that you want to appear in the browser.)

All of the static assets for our app are in the public folder. Whenever our app receives a GET request, it will first check in public to see if there is a file that matches the URL of the request. If it finds one, then it sends that file back as the response.

```javascript
app.use(express.static('public'));
```

## Create our new route

Our webpage already expects there to be an endpoint that gives it a list of all the posts.

It expects that endpoint to have the following:

- Endpoint URL: /get-posts
- Request Method: GET

So we are going to need to add a route for this endpoint. Add the following code:

```javascript
app.get('/get-posts', (req, res) => {});
```

This should go between app.use(express.static()) and app.listen() in your server.js file.

Note that the handler function here doesn’t do anything yet.

## Read the posts.json file

There is a post already stored in the data/posts.json file. We want to store other posts here, too, but you don’t need to worry about that yet - all you need to know is that this file has a post inside it.

## **If we want our /get-posts route’s handler function to display posts, we need to read the data/posts.json file from disk and send the data in it as our response.**

## The fs module

To read and write files we use the File System module fs. fs is included in Node.js but we still need to use require to import it into our app.

Add the following to the top of server.js to import fs

```javascript
const fs = require('fs');
```

### fs.readFile() takes two parameters:

- The path of the file to read from.
- A callback function to run after the file is read successfully.

\_\_dirname is a special Node.js variable that holds the path of the folder where your program is running.

### The content of data is in a format called a buffer. If you log it, it will look something like this: A buffer isn’t very useful for us here but we can invoke .toString() on it and get a human-readable text version of the file.

500 means “OMG something failed that we didn’t expect”.

Send the response in our callback function

```javascript
app.get('/get-posts', req, res) => {
    fs.readFile(\_\_dirname+'/data/posts.json', (err, data) => {
    if(err){
    console.log('Error reading posts.json: '+err);
    res.status(500);
    res.send(err);
    } else {
        res.send(data.toString());
    }
    });
});
```

- Check if there was an error
- If there was an error, log it and send back an error response.
- Otherwise, convert our data buffer to a string and send that as the response.

## Extract our Post

Your new post content from the text box is sent in the request as “form data”. This makes it difficult to extract. However someone has written a nice package called express-formidable for extracting form data.
What express-formidable does is automatically extract form data from the request, and add it back as an easy to use object called fields.

```
npm add express-formidable
```

```javascript
const formidable = require('express-formidable');
```

express-formidable is a middleware function, like express.static(). So we have to tell our app object to use it.

```javascript
app.use(formidable());
```

## Save New Post

```javascript
app.post('/create-post', (req, res) => {
  console.log(req.fields);
});
```

- get: An HTTP method for fetching data.
- post: An HTTP method for sending data.

```javascript
app.post('/create-post', (req, res) => {
    let now = Date.now();
    let newPost = {
    timestamp: now,
    content: request.fields.blogpost
}

    fs.readFile(\_\_dirname+'/data/posts.json', (err, data) => {
    if(err){
    console.log('Error reading posts.json: '+err);
    res.status(500);
    res.send(err);
    } else {
        res.send(newPost);
    }
    });
});
```

## Parse JSON

_JSON.parse() takes a string as a parameter and returns an object._

It also conveniently works with a file buffer too.

## Stringify JavaScript Objects

_Before writing our updated data to the data/post.json, we need to turn it back into a JSON string to be able to write on the file._

To do this, we are going to use the JSON.stringify() function. It’s like the opposite of JSON.parse().

_It takes any Javascript value as a parameter and returns the string of the JSON representation of it that value._

```javascript
fs.readFile(\_\_dirname+'/data/posts.json', (err, data) => {
    if(err){
    console.log('Error reading posts.json: ' + err);
        res.status(500);
        res.send(err);
    } else {
    const posts = JSON.parse(data);
    posts.blogposts.push(newPost);
    const updatedData = JSON.stringify(posts);

    fs.writeFile(__dirname+'/data/posts.json', updatedData,function(err){
      if(err){
        console.log('Error writing posts.json: ' + err);
        res.status(500);
        res.send(err);
      } else {
        res.send(newPost);
      }
    });
}
});
```
