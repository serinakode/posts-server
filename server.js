const express = require('express');
const formidable = require('express-formidable');
const fs = require('fs');
// const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(formidable());
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.post('/create-post', (req, res) => {
  const now = Date.now();

  const newPost = {
    timestamp: now,
    content: req.fields.blogpost,
    mood: req.fields.mood
  };

  fs.readFile(__dirname + '/data/posts.json', (err, data) => {
    if (err) {
      console.log('Err reading posts.json: ' + err);
      res.status(500);
      res.send(err);
    } else {
      const posts = JSON.parse(data);
      //   console.log(posts);
      //   console.log(posts.blogposts);
      //   console.log(posts.blogposts[0].content);
      //   console.log(posts.blogposts.length);
      posts.blogposts.push(newPost);
      //   console.log(posts.blogposts);
      const updatedData = JSON.stringify(posts);
      //   console.log(posts);
      //   console.log(updatedData);

      fs.writeFile(__dirname + '/data/posts.json', updatedData, function(err) {
        if (err) {
          console.log('Error writing posts.json: ' + err);
          res.status(500);
          res.send(err);
        } else {
          res.send(newPost);
        }
      });
    }
  });
});
// The client expects the response to contain the object converted into a JSON string.
// response.send() automatically does that conversion for you if you pass it an object.
// console.log(req.body);
// console.log(req.fields);

app.get('/chocolate', (req, res) => {
  res.send('Hello World');
});

app.get('/get-posts', (req, res) => {
  fs.readFile(__dirname + '/data/posts.json', (err, data) => {
    if (err) {
      console.log('Err reading posts.json: ' + err);
      res.status(500);
      res.send(err);
    } else {
      res.send(data.toString());
    }
  });
});

// app.get('*', (req, res) => {
//   res.send('Star intercepts everything');
// });

app.listen(8080, () => {
  console.log('server has started listening on port 8080');
});
