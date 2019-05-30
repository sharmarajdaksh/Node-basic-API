// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, OnjectID } = require('mongodb');

// const obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('COnnected to MongoDB server');

    // getOneAndUpdate
    db.db('TodosApp').collection('Todos')
        .findOneAndUpdate(
            {
                completed: false
            }, {
                //MongoDB update operators
                $set: {
                    completed: true
                }
            }, {
                returnOriginal: false
            })
        .then((result) => {
            console.log(result);
        })

    db.close()
});