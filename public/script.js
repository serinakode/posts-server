if (document.readyState !== 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}

function ready() {
  getBlogposts('/get-posts');

  // send posts to server
  var form = document.querySelector('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // prevents the form from contacting our server automatically (we want to do it ourselves)
    var formActionUrl = form.action; // 'form.action' is the url '/create-post'
    var formData = new FormData(form);

    postBlogposts(formActionUrl, formData);
  });
}

/****
 * Function definitions
 ***/
function postBlogposts(url, data) {
  fetch(url, {
    method: 'POST',
    body: data
  })
    .then(function(res) {
      res.json().then(function(json) {
        console.log(json);
        addBlogPostToPage(json);
        document.querySelector('form').reset();
      });
    })
    .catch(function(err) {
      console.error(err);
    });
}

// 2. delete post function

function deletePost(timestamp) {
  fetch('/delete-post/' + timestamp, {
    method: 'DELETE'
  })
    .then(function(res) {
      res.json().then(function(json) {
        if (json.success) {
          var element = document.getElementById(timestamp);
          element.outerHTML = '';
          delete element;
        } else {
          alert('Delete failed!');
        }
      });
    })
    .catch(function(err) {
      alert('Delete failed!\n\n' + err);
    });
}

function getBlogposts(url) {
  fetch(url, {
    method: 'GET'
  })
    .then(function(res) {
      res.json().then(function(json) {
        console.log(json);
        addBlogpostsToPage(json);
      });
    })
    .catch(function(err) {
      console.error(err);
    });
}

function addBlogPostToPage(post) {
  console.log('add one:', post);
  var postDiv = document.createElement('div');
  var postText = document.createElement('div');
  var postContainer = document.querySelector('.post-container');

  // put <p> tags around each separate line of blogpost, otherwise
  // they will all run together
  postText.innerHTML = post.content
    .split('\n')
    .map(function(item) {
      return '<p>' + item + '</p>';
    })
    .join('');
  postText.className = 'postBody';
  postDiv.id = post.timestamp;
  postDiv.className = 'post';

  var postDetail = document.createElement('div');
  postDetail.className = 'postDetail';
  postDetail.innerHTML = formatDate(post.timestamp);

  // 3. insert delete button here

  var delButton = document.createElement('div');
  delButton.onclick = function() {
    if (
      confirm(
        "Are you sure you want to delete this post?  You can't undo this."
      )
    ) {
      deletePost(post.timestamp);
    }
  };
  delButton.className = 'delButton';
  delButton.innerHTML =
    '<i class="fa fa-trash-o" aria-hidden="true"></i> Delete';
  postDetail.appendChild(delButton);

  // 2. insert mood display here

  var moodNames = [
    '',
    '<span class="emoji">😃</span> Happy',
    '<span class="emoji">😛</span> Joking',
    '<span class="emoji">😢</span> Sad',
    '<span class="emoji">😔</span> Regretful',
    '<span class="emoji">😡</span> Angry',
    '<span class="emoji">😲</span> Suprised',
    '<span class="emoji">😎</span> Smug',
    '<span class="emoji">👑</span> Triumphant',
    '<span class="emoji">😍</span> In love'
  ];
  var moodDiv = document.createElement('div');
  moodDiv.className = 'mood';
  moodDiv.innerHTML = moodNames[post.mood];
  postText.append(moodDiv);

  postDiv.appendChild(postText);
  postDiv.appendChild(postDetail);
  postContainer.prepend(postDiv);
}

function formatDate(timestamp) {
  var dateObj = new Date(timestamp);
  return dateObj.toLocaleString();
}

function addBlogpostsToPage(data) {
  for (var i = 0; i < data.blogposts.length; i++) {
    addBlogPostToPage(data.blogposts[i]);
  }
}
