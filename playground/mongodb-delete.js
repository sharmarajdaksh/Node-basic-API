const { MongoClient, OnjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('COnnected to MongoDB server');

    // // deleteMany
    // db.db('TodosApp').collection('Todos')
    //     .deleteMany({ text: 'Something to do' })
    //     .then((result) => {
    //         console.log(result);
    //     })

    // // deleteOne
    // db.db('TodosApp').collection('Todos')
    //     .deleteOne({ text: 'Something to do yet again' })
    //     .then((result) => {
    //         console.log(result);
    //     })

    // // findOneAndDelete
    // db.db('TodosApp').collection('Todos')
    //     .findOneAndDelete({ text: 'niBBas' })
    //     .then((result) => {
    //         // Gets back the first result before deleting
    //         console.log(result);
    //     })

    db.close();
});