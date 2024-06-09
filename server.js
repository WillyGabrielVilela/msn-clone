const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const users = {};
const userData = {};

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'User API for managing chat user data',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./server.js'], // path where API specification is written
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
/**
 * @swagger
 * /user/{userName}:
 *   put:
 *     summary: Update an existing user
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: integer
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */


app.get('/user/:userName', (req, res) => {
  const userName = req.params.userName;
  if (userData[userName]) {
    res.json(userData[userName]);
  } else {
    res.status(404).send('User not found');
  }
});

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               age:
 *                 type: integer
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
app.post('/user', (req, res) => {
  const { userName, age, cpf, email, gender } = req.body;

  if (!userName || !age || !cpf || !gender) {
    return res.status(400).send('All fields are required');
  }

  userData[userName] = { age, cpf, email, gender };
  res.status(201).send('User created');
});

/**
 * @swagger
 * /user/{userName}:
 *   put:
 *     summary: Update an existing user
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: integer
 *               cpf:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
app.put('/user/:userName', (req, res) => {
  const userName = req.params.userName;
  if (userData[userName]) {
    const { age, cpf, email, gender } = req.body;
    userData[userName] = { age, cpf, email, gender };
    res.send('User updated');
  } else {
    res.status(404).send('User not found');
  }
});

/**
 * @swagger
 * /user/{userName}:
 *   get:
 *     summary: Get user by username
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
app.get('/user/:userName', (req, res) => {
    const userName = req.params.userName;
    if (userData[userName]) {
      res.json(userData[userName]);
    } else {
      res.status(404).send('User not found');
    }
  });

  /**
 * @swagger
 * /user/{userName}:
 *   delete:
 *     summary: Delete user by username
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
  app.delete('/user/:userName', (req, res) => {
    const userName = req.params.userName;
    if (userData[userName]) {
      delete userData[userName];
      io.emit('user-disconnected', userName);
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
  
  
  

io.on('connection', (socket) => {
  console.log("Usuario Conectado");

  socket.on("new-user", userName => {
    users[socket.id] = userName;
    socket.broadcast.emit('user-connected', userName);
  });

  socket.on("message", incoming => {
    io.emit('message', incoming);
  });

  socket.on("joke", incomingJoke => {
    io.emit('joke', incomingJoke);
  });

  socket.on("nudge", userName => {
    socket.broadcast.emit('nudge', userName);
  });

  socket.on('typing', incoming => {
    socket.broadcast.emit('typing', incoming);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

http.listen(port, () => console.log(`Listening on port ${port}`));
