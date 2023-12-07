// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case


it('positive : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({username: 'Example', password: 'password'})
      .redirects(0)
      .end((err, res) => {

          // var body = res.body;
          // expect(body.message).to.equals('Success');
          // expect(res).to.redirectTo('/homepage');
        done();
      });
  });

  it('negative : /register', done => {
    chai
      .request(server)
      .post('/register')
      .send({username: 'Example', password: ''})
      .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.include('You need to enter a password');
        done();
      });
  });

//positive test for login
  it('Postitive : /login. Checking invalid name', done => {
    chai
      .request(server)
      .post('/login')
      .send({username: 'Example', password: 'password'})
      .redirects(0)
      .end((err, res) => {

        // expect(res.body.message).to.equals('Username and password are both required for login');

        expect(res).to.redirectTo('/homepage');
        done();

      });
  });
  //negative login test

  // //We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 200 along with a "Invalid input" message.
it('Negative : /login. Checking invalid name', done => {
  chai
    .request(server)
    .post('/login')
    .send({username: '', password: 'pass'})
    .end((err, res) => {

      // expect(res.body.message).to.equals('Username and password are both required for login');
      // expect(res).to.have.status(500);
      expect(res).to.have.status(200);
      expect(res.text).to.include('Username and password are both required for login');
      done();

    });
});


  //test 1 of 2 for part B
  it('Postitive : /logout. User redired to homepage', done => {
    chai
      .request(server)
      .get('/logout')
      .redirects(0)
      .end((err, res) => {

        // expect(res.body.message).to.equals('Username and password are both required for login');

        expect(res).to.redirectTo('/login');
        done();

      });
  });






});