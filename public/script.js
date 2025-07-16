// Fetch data from backend API and display it on the site
// Fetch backend API data and display it in the backend section
document.addEventListener("DOMContentLoaded", () => {
const BASE_URL = "https://smriti-neupane-portfolio.onrender.com";
  const postsContainer = document.getElementById("posts-container");
  const postForm = document.getElementById("post-form");
  const postIdInput = document.getElementById("post-id");
  const postTitleInput = document.getElementById("post-title");
  const postContentInput = document.getElementById("post-content");
  const formTitle = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  // Fetch and render posts
  function loadPosts() {
  fetch(`${BASE_URL}/api/posts`)
      .then((res) => res.json())
      .then((posts) => {
        if (posts.length === 0) {
          postsContainer.innerHTML = "<p>No blog posts found.</p>";
          return;
        }
        postsContainer.innerHTML = posts
          .map(
            (post) => `
          <div class="post" data-id="${post.id}">
            <h2>${post.title}</h2>
            <small>${post.date}</small>
            <p>${post.content}</p>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `
          )
          .join("");

        // Attach edit and delete event listeners
        document.querySelectorAll(".edit-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const postDiv = e.target.closest(".post");
            const id = postDiv.getAttribute("data-id");
            const title = postDiv.querySelector("h2").textContent;
            const content = postDiv.querySelector("p").textContent;

            postIdInput.value = id;
            postTitleInput.value = title;
            postContentInput.value = content;

            formTitle.textContent = "Edit Post";
            submitBtn.textContent = "Update Post";
            cancelBtn.style.display = "inline";
            window.scrollTo({ top: postForm.offsetTop, behavior: "smooth" });
          });
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const postDiv = e.target.closest(".post");
            const id = postDiv.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this post?")) {
            fetch(`${BASE_URL}/api/posts/${id}`, { method: "DELETE" })
                .then((res) => {
                  if (res.status === 204) {
                    loadPosts();
                  } else {
                    alert("Failed to delete post");
                  }
                })
                .catch(() => alert("Error deleting post"));
            }
          });
        });
      })
      .catch(() => {
        postsContainer.innerHTML = "<p>Failed to load blog posts.</p>";
      });
  }

  loadPosts();

  // Handle form submit for add/edit
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = postIdInput.value;
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    const postData = { title, content };

    if (id) {
      // Update post
      fetch(`${BASE_URL}/api/posts/${id}`,  {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })
        .then((res) => res.json())
        .then(() => {
          resetForm();
          loadPosts();
        })
        .catch(() => alert("Failed to update post"));
    } else {
      // Create post
     fetch(`${BASE_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })
        .then((res) => res.json())
        .then(() => {
          resetForm();
          loadPosts();
        })
        .catch(() => alert("Failed to create post"));
    }
  });

  // Reset form to initial state
  function resetForm() {
    postIdInput.value = "";
    postTitleInput.value = "";
    postContentInput.value = "";
    formTitle.textContent = "Add New Post";
    submitBtn.textContent = "Add Post";
    cancelBtn.style.display = "none";
  }

  // Cancel edit
  cancelBtn.addEventListener("click", () => {
    resetForm();
  });
});



 
