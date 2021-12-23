require('dotenv').config();
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const controllers = require('./controllers');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    //orogin: [`*`],
    //origin: [`http://localhost:3000`],
    allowedHeaders: ['Authorization, Content-Type'],
    //exposedHeaders: ['Authorization'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  })
);
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.post('/login', controllers.login);
app.post('/signup', controllers.signup);
app.post('/logout', controllers.logout);

//GET
app.get('/activity', controllers.activity);
app.get('/userInfo', controllers.userInfo);
app.get('/auth', controllers.auth);
app.get('/notification', controllers.notification);

app.get('/episode-infos', controllers.episodeInfos); // 에피소드 정보 조회
app.get('/comments', controllers.comments); // 댓글 정보 조회
app.post('/comments/add', controllers.add); // 댓글 작성
app.delete('/comments/:commentId', controllers.delete); // 댓글 삭제
app.patch('/comments/:commentId', controllers.modify); // 댓글 수정
app.get('/replies', controllers.reply);
app.post('/comments/likes/:commentId', controllers.like); // 좋아요
app.patch('/checkNotification/:notiId', controllers.checkNotification);

//PUT
app.patch('/passwordModify', controllers.passwordModify);

//DELETE
app.delete('/signout', controllers.signout);
app.delete('/deleteNotification/:notiId', controllers.deleteNotification);

const HTTPS_PORT = process.env.HTTPS_PORT || 8000;

let server;
if (fs.existsSync('./key.pem') && fs.existsçSync('./cert.pem')) {
  const privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
  const certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  server = https.createServer(credentials, app);
  server.listen(HTTPS_PORT, () =>
    console.log('https server runnning', `\nport number is ${HTTPS_PORT}`)
  );
} else {
  server = app.listen(HTTPS_PORT, () =>
    console.log('http server runnning', `\nport number is ${HTTPS_PORT}`)
  );
}
module.exports = server;
