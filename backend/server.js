const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Helper function to read posts from posts.json
function readPosts() {
  const filePath = path.join(__dirname, "posts.json");
  if (!fs.existsSync(filePath)) {
    // If file doesn't exist, return empty array
    return [];
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Helper function to save posts to posts.json
function savePosts(posts) {
  const filePath = path.join(__dirname, "posts.json");
  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
}

// 1. Get all posts
app.get("/api/posts", (req, res) => {
  try {
    const posts = readPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error reading posts" });
  }
});

// 2. Create new post
app.post("/api/posts", (req, res) => {
  try {
    const posts = readPosts();

    const { title, content } = req.body;

    // Basic validation
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // Create new post object with unique id and current date
    const newPost = {
      id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
      title,
      content,
      date: new Date().toISOString().split("T")[0],
    };

    // Add new post to array
    posts.push(newPost);

    // Save updated posts array back to file
    savePosts(posts);

    // Send created post as response
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Error saving post" });
  }
});

//  Update existing post by id
app.put("/api/posts/:id", (req, res) => {
  try {
    const posts = readPosts();
    const postId = parseInt(req.params.id);

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const index = posts.findIndex((post) => post.id === postId);

    if (index === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the post fields
    posts[index].title = title;
    posts[index].content = content;

    // Save updated posts array
    savePosts(posts);

    res.json(posts[index]);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// 4. Delete post by id
app.delete("/api/posts/:id", (req, res) => {
  try {
    const posts = readPosts();
    const postId = parseInt(req.params.id);

    // Filter out the post to delete
    const filteredPosts = posts.filter((post) => post.id !== postId);

    if (filteredPosts.length === posts.length) {
      return res.status(404).json({ error: "Post not found" });
    }

    savePosts(filteredPosts);

  
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});


app.use(express.static("public"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


