// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, OnjectID} = require('mongodb');

// const obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('COnnected to MongoDB server');

    // Select the Todos collection
    const todos = db.db('TodosApp').collection('Todos');
    //Add a new record in the collection
    todos.insertOne({
        text: 'Something to do yet again',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    
    const users = db.db('TodosApp').collection('Users');
    //Add a new record in the collection
    users.insertOne({
        name: 'Dex',
        age: 20,
        location: 'Chandigarh'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
        // First 4 bytes of the unique ObjectID is the timestamp
        // Last 3 byte are MachineID
        console.log(result.ops[0]._id.getTimestamp()); //Gets the time stamp
    })

    db.close();
});