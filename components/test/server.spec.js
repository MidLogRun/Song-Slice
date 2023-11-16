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


//We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
//Positive cases
// it('positive : /login', done => {
//   chai
//     .request(server)
//     .post('/login')
//     .send({username: req.body.username, email: req.body.email, password: req.body.password})
//     .end((err, res) => {

//       expect(res).to.have.status(200);
//       expect(username).to.equal('Example Name');
//       expect(email).to.equal('example@gmail.com');
//       expect(password).to.equal('examplePassword')

//       expect(res.body.message).to.equal('Success');
//       done();
//     });
// });



// //We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 200 along with a "Invalid input" message.
// it('Negative : /login. Checking invalid name', done => {
//   chai
//     .request(server)
//     .post('/login')
//     .send({username: req.body.username, email: req.body.email, password: req.body.password})
//     .end((err, res) => {

//       expect(res).to.have.status(200);
//       expect(username).not.to.equal('Example Name');
//       expect(email).not.to.equal('example@gmail.com');
//       expect(password).not.to.equal('examplePassword')

//       expect(res.body.message).to.equals('Invalid input');
//       done();
//     });
// });



// it('positive : /register', done => {
//   chai
//     .request(server)
//     .post('/register')
//     .send({username: req.body.username, email: req.body.email, password: req.body.password, confirmPassword: req.body.confirmPassword})
//     .end((err, res) => {

//       expect(username).to.be.a('string');
//       expect(email).to.include('@');
//       expect(email).to.include('.');
//       expect(password).to.equal(confirmPassword);
//       expect(res.body.message).to.equals('Success');
//       done();
      
//     });
// });


// it('negative : /register', done => {
//   chai
//     .request(server)
//     .post('/register')
//     .send({username: req.body.username, email: req.body.email, password: req.body.password, confirmPassword: req.body.confirmPassword})
//     .end((err, res) => {

//       expect(username).to.be.a('string');
//       expect(email).to.not.include('@');
//       expect(email).to.not.include('.');
//       expect(password).to.not.equal(confirmPassword);
//       expect(res.body.message).to.equals('Invalid Input');
//       done();
      
//     });
// });

});