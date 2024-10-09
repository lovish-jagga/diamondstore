const path = require('path');
const express = require('express');
const db=require('./database/database')
const auth=require('./routes/auth')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/',
    databaseName:'shopping',
    collection: 'mySessions'
  });
  
const app = express();

// Activate EJS view engine
app.set('view engine','ejs')

app.set('views',path.join(__dirname,'views'))


app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.json());
app.use(express.static('public')); // Serve static files (e.g. CSS files)
app.use('/img',express.static('img'))

app.use(require('express-session')({
  secret: 'This is my project',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: false
}));

app.use(async function(req,res,next){
  const user=req.session.user;
  const isAuthenticated=req.session.isAuthenticated;

  if(!user || !isAuthenticated){
    return next();
  }
  await db.getDb().collection('userLoginTable').find({_id:user.id})
  const email=user.email;
  const fullName=user.fullNameSignUp;

  res.locals.fullName=fullName;
  res.locals.email=email;
  res.locals.isAuthenticated=isAuthenticated;

  next();
})

app.use(auth);

app.get('/',function(req,res){
    res.redirect('/products')
})
db.connectToDatabase().then(function(){
    app.listen(3000)
})
