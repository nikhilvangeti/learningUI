var express=require('express');
var bodyParser=require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert=require('assertion');

const url='mongodb://localhost:27017/test';
const dbName="bookData";

MongoClient.connect(url,function(err,client){
    assert.equal(null,err);
    console.log("connected successfully to server");
    client.close();

});


var app=express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine', 'ejs');

app.get('/', function(req,res){
    res.render('index');
});

app.get('/addRow',function(req,res){
  res.render('addRow');
});

app.get('/about',function(req,res){
    res.render('about');
});

app.get('/deleteRow',function(req,res){
    MongoClient.connect(url,function(err,client){
        assert.equal(null,err);
        var db=client.db(dbName);
        db.collection('bookData').find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log("here with data from db");
            res.render('deleteRow',{items: result});
            client.close();
        });
    });
});

app.post('/remove',function(req,res){
    var isbnToRemove=req.body.isbn;
    var msg='';
    MongoClient.connect(url,function(err,client){
        assert.equal(null,err);
        var db=client.db(dbName);
        var myQuery={isbn:isbnToRemove};
        db.collection('bookData').deleteOne(myQuery,function(err,result){
            assert.equal(null,err);
            console.log("one document deleted");
            res.render('deleteDone',{msg: "record deleted"});
            client.close();
        });
    });
});

app.get('/displayBooks',function(req,res){
    MongoClient.connect(url,function(err,client){
        assert.equal(null,err);
        var db=client.db(dbName);
        db.collection('bookData').find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log("here with data from db");
            res.render('displayBooks',{items: result});
            client.close();
        });
    });
});

app.get('/editAndUpdate',function(req,res){
    MongoClient.connect(url,function(err,client){
        assert.equal(null,err);
        var db=client.db(dbName);
        db.collection('bookData').find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log("here with data from db");
            res.render('editAndUpdate',{items: result});
            client.close();
        });
    });
});

app.post('/update',function(req,res){
    var isbnToUpdate=req.body.isbn;
    MongoClient.connect(url,function(err,client){
        assert.equal(null,err);
        var db=client.db(dbName);
        var myQuery={isbn:isbnToUpdate};
        db.collection('bookData').find(myQuery).limit(1).toArray(function(err, result) {
            if (err) throw err;
            console.log('got data to update');
            console.log(result);
            res.render('finalUpdate',{items: result});
            client.close();
        });
    });
});

app.post('/save',function(req,res){
    var isbnToUpdate=req.body.isbn;
    var bookNameToUpdate=req.body.bookName;
    var authorToUpdate=req.body.author;
    var publishedYearToUpdate=req.body.publishedYear;

    console.log(isbnToUpdate);
    console.log(bookNameToUpdate);
    console.log(authorToUpdate);
    console.log(publishedYearToUpdate);

    var msg='';
    MongoClient.connect(url,function(err,client){
        assert.equal(null,err);
        var db=client.db(dbName);
        var myQuery={isbn:isbnToUpdate};
        var newValues={$set: {bookName:bookNameToUpdate , author:authorToUpdate, publishedYear:publishedYearToUpdate}}
        db.collection('bookData').updateOne(myQuery,newValues,function(err,result){
            assert.equal(null,err);
            console.log(result);
            console.log("one document updates");
            res.render('updateDone',{msg: "record updated"});
            client.close();
        });
    });
});

app.post('/insert',function(req,res){
var item={
    bookName:req.body.bookName,
    isbn:req.body.isbn,
    author:req.body.author,
    publishedYear:req.body.publishedYear
}
var msg='';
MongoClient.connect(url,function(err,client){
    assert.equal(null,err);
    var db=client.db(dbName);
    db.collection('bookData').insertOne(item,function(err,result){
        assert.equal(null,err);

        console.log('item inserted');
        res.render('addDone',{msg:'item inserted'});
        client.close();
    })
})
});


app.listen(3000,function(){
    console.log("Logged in to server at port 3000");
})
