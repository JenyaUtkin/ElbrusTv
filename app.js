require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const hbs = require('hbs');

const FileStore = require('session-file-store')(session);
const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
// const postsRouter = require('./routes/posts');
// const { helloMiddleware, checkRole } = require('./middleware/allMiddleWare');

const app = express();
const PORT = process.env.PORT || 3000;
hbs.registerPartials(path.join(process.env.PWD, 'src', 'views', 'partials'))

app.set('views', path.join(process.env.PWD, 'views'));
app.set('view engine', 'hbs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(process.env.PWD, 'public')));

app.use(cookieParser());
app.use(session({ // дает возможность использовать req.session для записи чего-либо
  store: new FileStore({}), // если не работает попробуй ввести в терминале chmod -R 777 sessions
  secret: process.env.SECRET || 'vcxbfrscxcvcv', // фраза для шифрования - секретный ключ
  resave: false, // будем ли сохранять новую сессию поверх старой?
  saveUninitialized: false, // когда будет создаваться сессия, сразу после прихождения?
  cookie: { secure: false }, // HTTPS = false
  name: 'coki', // имя куки
})); // req.session

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use('/posts', postsRouter);

app.listen(PORT, () => {
  console.log('Server started on port: ', PORT);
});
