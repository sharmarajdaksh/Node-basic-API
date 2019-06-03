const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

const id = '5cf21f0c1c0aba3052d3c4ba';

Todo.remove({}).then((result) => {
    console.log(result);
})

Todo.findOneAndRemove({ _id: id }).then((todo) => {
    console.log(todo);
})

Todo.findByIdAndRemove({id}).then((todo) => {
    console.log(todo);
})