const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {

    const email = 'xample@xample.com';
    const password = '123mnb';

    it('should create a user', (done) => {
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers).toHaveProperty('x-auth');
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).not.toBe(null);
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({ email: 'invalidemail', password })
            .expect(400)
            .end(done)
    });

    it('should not create user if email is in use', (done) => {
        request(app)
            .post('/users/me')
            .send({ email: users[0].email, password: 'password123' })
            .expect(404)
            .end(done);
    });

});

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers).toHaveProperty('x-auth');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toHaveProperty('access', 'auth');
                    expect(user.tokens[0]).toHaveProperty('token', res.headers['x-auth']);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'incorrectPassword'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers).not.toHaveProperty('x-auth');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {

    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done()
                }).catch((e) => done(e));
            });
    });
});