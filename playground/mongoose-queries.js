const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

const id = '5cf21f0c1c0aba3052d3c4ba';

if (!ObjectID.isValid(id)) {
    console.log('ID not valid')
}

// Get all objects
Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
});

// Get first matching item
Todo.findOne({
    _id: id
}).then((todo) => {
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
    if (!todo) {
        return console.log('Id not found');
    }
    console.log('Todo by id', todo)
}).catch((e) => {
    console.log(e);
});