const express = require('express');
const users = require('./MOCK_DATA.json');

const app = express();
const PORT = 3000;
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});