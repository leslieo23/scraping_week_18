
var request = require('request');
var cheerio = require('cheerio');
var express=require ('express');
var logger=require('morgan');
var app= express();

var mongojs=require('mongojs');
var databaseUrl="week18db";
var collections=["week18db"];
var db= mongojs(databaseUrl,collections);
db.on('error',function(err){
  console.log('Database Error:',err);
});

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));




//routes
app.get('/',function(req,res){
  res.send('This Works')
});

//db

app.get('/info',function(req,res){
  db.week18db.find({},function(req,res){
    if(err){
      console.log(err);
    }else{
      res.json(found);
    }
  });
});

app.get('/scraped',function(req,res){
  request('https://news.ycombinator.com/',function(error,response,html){
    var $=cheerio.load(html);
    $('.title').each(function(i,element){
      var title= $(this).children('a').text();
      var link=$(this).children('a').attr('href');

      if(title && link){
        db.week18db.save({
          title:title,
          link:link
        }, function(err,saved){
          if (err){
            console.log(err);
          }else{
            console.log(saved);
          }
        
        });
      }
    });
  })
  res.send('Scraped Complete');
});

app.listen(3000,function(){
  console.log('App is running on port 3000!')
})