const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

function logRequests(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next();
}

function basicAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Access denied. No credentials sent.');
    }
    const base64 = authHeader.split(' ')[1];
    const [username, password] = Buffer.from(base64, 'base64')
    .toString('utf8')
    .split(':');
    if (username == 'admin' && password == '1234') {
        req.user = { username: 'admin' };
    } else{
       req.user = { username: 'user' };
    }
  
    next();
}

function validateUserInput(req, res, next) {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).send('Missing required fields: username and password');
    }
    next();
}

function checkArticleAccess(req, res, next){
    if (req.user.username != "admin"){
      return res.status(401).send('No access.');
    }
    next();
}
app.use(express.json())
app.use(logRequests);
app.use('/users', basicAuth);
app.use('/articles', basicAuth ,checkArticleAccess);


router.get('/', (req, res) => {
  res.send(`Get root route`);
});

router.get('/users', (req, res) => {
  res.send('Get users route');
});

router.post('/users', validateUserInput, (req, res) => {
  res.send('User created');
});




// Визначення маршруту з параметром
router.get('/users/:userId', (req, res) => {
  res.send(`Get user by Id route: ${req.params.userId}`);
});
// Створення маршрутного обробника для різних типів запитів

router.put('/users/:userId', (req, res) => {
  res.send(`Put user by Id route: ${req.params.userId}`);
});

router.delete('/users/:userId', (req, res) => {
  res.send(`Delete user by Id route:  ${req.params.userId}`);
});

router.get('/articles', (req, res) => {
  res.send(`Get articles route`);
});
router.post('/articles', (req, res) => {
  res.send(`Post articles route`);
});
router.get('/articles/:articleId', (req, res) => {
  res.send(`Get article by Id route: ${req.params.articleId}`);
});
router.put('/articles/:articleId', (req, res) => {
  res.send(`Put article by Id route:  ${req.params.articleId}`);
});
router.delete('/articles/:articleId', (req, res) => {
  res.send(`Delete article by Id route: ${req.params.articleId}`);
});


// Використання роутера
app.use('/', router);




// Запускаємо сервер
app.listen(port, () => {
  console.log(`Сервер запущено за адресою <http://localhost>:${port}`);
});