if (document.readyState !== 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}

function ready() {
  getBlogposts('/get-posts');

  // send posts to server
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevents the form from contacting our server automatically (we want to do it ourselves)
    let formActionUrl = form.action; // 'form.action' is the url '/create-post'
    let formData = new FormData(form);

    postBlogposts(formActionUrl, formData);
  });
}

/****
 * Function definitions
 ***/
postBlogposts = (url, data) => {
  fetch(url, {
    method: 'POST',
    body: data
  })
    .then((res) => {
      res.json().then((json) => {
        console.log(json);
        addBlogPostToPage(json);
        document.querySelector('form').reset();
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

// 2. delete post function

deletePost = (timestamp) => {
  fetch('/delete-post/' + timestamp, {
    method: 'DELETE'
  })
    .then((res) => {
      res.json().then((json) => {
        if (json.success) {
          let element = document.getElementById(timestamp);
          element.outerHTML = '';
          delete element;
        } else {
          alert('Delete failed!');
        }
      });
    })
    .catch((err) => {
      alert('Delete failed!\n\n' + err);
    });
};

getBlogposts = (url) => {
  fetch(url, {
    method: 'GET'
  })
    .then((res) => {
      res.json().then((json) => {
        console.log(json);
        addBlogpostsToPage(json);
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

addBlogPostToPage = (post) => {
  console.log('add one:', post);
  let postDiv = document.createElement('div');
  let postText = document.createElement('div');
  let postContainer = document.querySelector('.post-container');

  // put <p> tags around each separate line of blogpost, otherwise
  // they will all run together
  postText.innerHTML = post.content
    .split('\n')
    .map((item) => {
      return '<p>' + item + '</p>';
    })
    .join('');
  postText.className = 'postBody';
  postDiv.id = post.timestamp;
  postDiv.className = 'post';

  const postDetail = document.createElement('div');
  postDetail.className = 'postDetail';
  postDetail.innerHTML = formatDate(post.timestamp);

  // 3. insert delete button here

  const delButton = document.createElement('div');
  delButton.onclick = () => {
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

  const moodNames = [
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
  const moodDiv = document.createElement('div');
  moodDiv.className = 'mood';
  moodDiv.innerHTML = moodNames[post.mood];
  postText.append(moodDiv);

  postDiv.appendChild(postText);
  postDiv.appendChild(postDetail);
  postContainer.prepend(postDiv);
};

formatDate = (timestamp) => {
  const dateObj = new Date(timestamp);
  return dateObj.toLocaleString();
};

addBlogpostsToPage = (data) => {
  for (let i = 0; i < data.blogposts.length; i++) {
    addBlogPostToPage(data.blogposts[i]);
  }
};
