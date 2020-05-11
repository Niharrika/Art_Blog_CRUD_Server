const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoClient = require ('mongodb');
const url = "mongodb+srv://Niharrika:Mymongoatlas@cluster0-jmoet.mongodb.net/test1?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.get('/list',function(req,res){
	mongoClient.connect(url,function(err,client){
		if (err) throw err;
		var db = client.db("demoDb");
		var a = db.collection("user").find().toArray();
		a.then(function(data){
			client.close();
			res.json(data)
		}).catch(function(err){
			client.close();
			res.status(400).json({
				message : "Error"
			})
		})
	})
})

app.post('/users',function(req,res){
	console.log(req.body);
	mongoClient.connect(url,function(err,client){
		if (err) throw err;
		var db = client.db("demoDb");
		db.collection("user").insertOne(req.body,function(err,data){
			if (err) throw err;
			client.close();
			console.log("data stored")
			res.send(data)
		})
	})
})
app.put('/update', function (req, res) {
    let pid=req.body.id
    mongoClient.connect(url, function (err, client) {
        if (err) throw err;
        var db = client.db("demoDb");
        var ObjectId = require('mongodb').ObjectID;
        db.collection("user").updateOne(
            {id: pid},
            { $set: {name:req.body.name,price:req.body.price,currency:req.body.currency} }, function (err, result) {
                if (err) throw err;
                client.close();
				console.log("Product Updated")
				console.log(req.body.id)
                res.json({
                    message: "Product updated"
                })
            });
    });
});

app.delete('/delete/:id',function(req,res){
	let id=req.params.id
	console.log(id)
	var ObjectId = require('mongodb').ObjectID; 
	mongoClient.connect(url,function(err,client){
		if (err) throw err;
		var db = client.db("demoDb");
		db.collection("user").deleteOne ({ _id: ObjectId(id)}), function(err, data) {
			if (err) throw err;
			client.close();
			console.log("Product deleted")
			console.log(id)
			res.json({
				message: "Product Deleted"
			})
		}
	})
})
app.listen(process.env.PORT, function () {
	console.log("port is running in 3000")
})