const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');
const mongoose = require('mongoose');


const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose
.connect("mongodb://127.0.0.1:27017/mongoapp1")
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Define a Mongoose schema and model
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  jobTitle: {
    type: String,
  },
  gender:{
    type: String,
  }
 });

const User = mongoose.model('user', userSchema);
//middleware-pluggin
app.use(express.urlencoded({ extended: false }));

app.use(req, res, next => {
    console.log(`hello from middleware 1`);
    next();
}
);


//routes
app.get("/users", (req, res) => {
    const html = `<ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    res.send(html);
}
);

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
   const body = req.body;
   console.log(body);
   users.push({...body, id: users.length + 1});
   fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err,data) => {
    return res.json({ message: 'User created' });
});
});

app.route('/api/users/:id')
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const updatedbody = req.body;
    const userIndex = users.findIndex((user) => user.id === id);
    users[userIndex] = { ...users[userIndex], ...updatedbody };
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "Success", Updated: users[userIndex] });
    });
    })
  
  .delete((req, res) => {
    // todo: delete user
    const id = Number(req.params.id);

    // DEBUG: Log IDs in the array to check
    console.log('Requested ID to delete:', id);
    console.log('Existing user IDs:', users.map(u => u.id));
  
    const userIndex = users.findIndex(user => user.id === id);
  
    // If no match found
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Delete user at the correct index
    const deletedUser = users.splice(userIndex, 1)[0];
  
    return res.json({ message: 'User deleted', user: deletedUser });
  });
  


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});