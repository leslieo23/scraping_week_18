var express=require('express');
var app = express();
var logger= require('morgan');
var mongoose=require('mongoose');
var request=require('request');
var cheerio=require('cheerio');
var path= require('path');

var staticContentFolder=__dirname + '/public'

app.use(express.static(staticContentFolder));
//===================================================================
mongoose.connect('mongodb://localhost/mongoosescraper');
var db= mongoose.connection;

db.on('error',function(err){
	console.log('Mongoose Error',err);
});
db.once('open',function(){
	console.log('Mongoose connection successful');
});

var Saved =require('./models/saved.js')
var Read=require('./models/read.js')

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/../index.html'));
})

app.get('/scrape',function(req,res){
	request('http://echojs.com/',function(err,response,html){
		var $ =cheerio.load(html);
		$('article h2').each(function(i,element){
			
			var result={};

			result.title=$(this).children('a').text();
			result.link=$(this).children('a').attr('href');

			var entry= new Read(result);
			entry.save(function(err,doc){
				if (err){
					console.log(err)
				}else{
					console.log(doc)
				}
			});

 
		});
	});
	res.send("Scrape Complete");
});

app.get('/read/:id',function(req,res){
	Read.findOne({'_id': req.params.id})
	.populate('Saved')
	.exec(function(err,doc){
		if(err){
			console.log(err)
		}else{
			res.json(doc);
		}
	});
});

app.post('/read/:id',function(req,res){
	var newRead=new Read(req.body);

	newRead.save(function(err,doc){
		if(err){
			console.log(err)
		}else{
			Read.findOneAndSave({
				'_id':req.params.id},{'Read':doc._id})
			.exec(function(err,doc){
				if(err){
					console.log(err)
				}else{
					res.send(doc)
				}
			});
		};
	});
});

app.listen(3000,function(){
	console.log('App running on port 3000!')
})