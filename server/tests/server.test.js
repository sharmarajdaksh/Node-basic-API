const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
},];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {

        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                })
                    .catch((err) => done(err));
            });
    });

    it('should not create todo with invalid body data', (done) => {

        let text = '';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(400)
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                })
                    .catch((err) => done(err));
            });

    })
});

describe('GET /todos', () => {

    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {

    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString() + 1}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is not valid', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                    expect(todo).toBeNull();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString() + 1}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id is not valid', (done) => {
        request(app)
            .delete(`/todos/abc`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {

    const id1 = todos[0]._id.toHexString();
    const id2 = todos[1]._id.toHexString();

    it('should update the todo', (done) => {
        request(app)
            .patch(`/todos/${id1}`)
            .send({
                text: 'dis text changed',
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('dis text changed');
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        request(app)
            .patch(`/todos/${id2}`)
            .send({
                text: 'dis text has also changed',
                completed: false,
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('dis text has also changed');
                expect(res.body.todo.completed).toBe(false);
                expect(typeof res.body.todo.completedAt).not.toBe('number');
            })
            .end(done);
    });

});