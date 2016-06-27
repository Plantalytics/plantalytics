/*
 * Plantalytics
 *     Copyright (c) 2016 Sapphire Becker, Katy Brimm, Scott Ewing,
 *       Matt Fraser, Kelly Ledford, Michael Limb, Steven Ngo, Eric Turley.
 *     This project is licensed under the MIT License.
 *     Please see the file LICENSE in this distribution for license terms.
 * Contact: plantalytics.capstone@gmail.com
 */

QUnit.module("login");
/*
QUnit.test( "Login Test", function( assert ) {
    // Expecting there to be two assertions
    assert.expect(2)

    //Creating a testing fixture -- QUnit auto-cleans up these features
    var $fixture = $("#qunit-fixture");
    //Adding an element to this temporary testing fixture
    $fixture.append('<a id="loginButton">Login</a>');
    var $loginButton=$("#loginButton");

    // Override click function from login.js to assert True to indicate it's been clicked.
    // Ideally we'd like to mock or refactor the login button to have some kind of output or response to
    // use for our assertions.
    $loginButton.click(function(){
       assert.ok(true, "Login has been clicked.")
    });

    // Assert the button exists
    assert.equal($loginButton.length, 1, "Login button exists");
    // Click the button (and expecting an assertion of True)
    $loginButton.click();
});
*/
QUnit.test("Login Page Loads and button exists", function(assert){
    assert.expect(3);
    var done = assert.async();
    
    var xhr = $.ajax({
        type: 'GET',
        url: 'login.html'
    })
    .always(function(data, status){
        assert.equal(status, "success");
        response = $(data);
        pageTitle = response.filter('title').text();
        loginButton = response.find('#loginButton')
        assert.equal(loginButton.length, 1, "Login button exists");
        assert.equal(pageTitle, 'Plantalytics Login', 'Title of login.html should be Plantalytics Login');

        done();
    })
});

QUnit.module("dashboard");
