const { MongoClient, OnjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('COnnected to MongoDB server');

    db.db('TodosApp').collection('Todos').
        find({ completed: true }).
        toArray().
        then((docs) => {
            console.log('Todos');
            console.log(JSON.stringify(docs, undefined, 2))
        }, (err) => {
            console.log('Unable to fetch Todos ', err)
        });

    db.db('TodosApp').collection('Todos').
        find({ completed: true }).
        count().
        then((count) => {
            console.log('Todos count: ', count);
        }, (err) => {
            console.log('Unable to fetch Todos ', err)
        });

    // db.close();
});