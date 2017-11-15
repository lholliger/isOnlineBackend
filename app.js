const express = require('express')
const fs = require('fs')
const requestify = require('requestify');
require("./functions.js")

let users = require('./accounts.json')
const app = express()
let total_users = Object.size(users);
let userStatuses = {};

console.log(total_users + " Users Have Accounts");

// check if iO member
app.get("/ismemeber/:username", function(req, res) {
    var to_request = req.params.username;
    if (users[to_request] == undefined) {
        res.send('{"status":false}');
    }
    else {
        res.send('{"status":true}');
    }
});


//User Count Getter
app.get("/count", function(req, res) {
    total_users = Object.size(users)
    res.send('{"total":' + Object.size(users) + '}');
});

//Get Status Single

app.get("/getStatus/:username", function(req, res) {
    let username = req.params.username;

    function sendTimeStamp(timestamp, status) {
        res.send('{"timestamp":"' + timestamp + '", "status":"' + status + '"}');
    }

    //Does user account even exist
    if (users[username] != undefined) {
        //Have We logged them?
        if (userStatuses[username] != undefined) {
            sendTimeStamp(userStatuses[username].lp, users[username].status);
        }
        else {
            //If not; timestamp of 0 :P
            sendTimeStamp(0, users[username].status);
        }
    }
    else {
        res.send('{"error":"User does not exist"}');
    }
});

//Get Status Bulk

app.get("/getStatusBulk/*", function(req, res) {
    //Get users sorry Hampton the past you was to dumb to find a cooler way to do it
    let requestedUsers = req.url.replace("/getStatusBulk/", "").split("/");
    var response = {}

    function sendTimeStamp(timestamp, status) {
        return ({ timestamp: timestamp, status: status });
    }

    function getUserStatus(username) {
        if (users[username] != undefined) {
            //Have We logged them?
            if (userStatuses[username] != undefined) {
                return (sendTimeStamp(userStatuses[username].lp, users[username].status));
            }
            else {
                //If not; timestamp of 0 :P
                return (sendTimeStamp(0, users[username].status));
            }
        }
        else {
            return ({ error: "User does not exist" });
        }
    }

    for (i in requestedUsers) {
        response[requestedUsers[i]] = getUserStatus(requestedUsers[i])
    }

    res.send(JSON.stringify(response));
});

//User Count Setter
app.get("/status/:username/:key", function(req, res) {
    let username = req.params.username;
    let key = req.params.key;
    if (users[username] != undefined) {
        //does user account have key
        //this is to prevent stupid errors that JS would spit without using ugly try {}
        if (users[username].key == key) {
            userStatuses[username] = { lp: Math.round((new Date()).getTime() / 1000) }
            res.send('{"success":"status changed"}');
        }
        else {
            res.send('{"error":"Wrong Key"}');
        }
    }
    else {
        res.send('{"error":"Wrong Key"}');
    }
});



// check if key is valid
app.get("/test/:username/:key", function(req, res) {
    let username = req.params.username;
    let key = req.params.key;
    //does user account even exist
    if (users[username] != undefined) {
        //does user account have key
        //this is to prevent stupid errors that JS would spit without using ugly try {}
        if (users[username].key == key) {
            res.send('{"status":true}');
        }
        else {
            res.send('{"status":false}');
        }
    }
    else {
        res.send('{"status":false}');
    }
});



app.get("/verify/:username/:id", function(req, res) {
    let username = req.params.username;
    let id = req.params.id;
    verify(username, id, function(ret) {
        if (ret) {
            res.send("verified");
        }
        else {
            res.send("denied");
        }
    });

});


// Basic 404

app.get('*', function(req, res) {
    res.send('{"status":404}');
    switch (req.url) {
        case "/favicon.ico": //I AM SICK OF THIS %&^%*$ ERROR
            break;
        default:
            console.log("some idiot tried to request " + req.url);
    }

});


var port = 8080;
app.listen(port, () => console.log('isOnline v2 is running on port ' + port))

// when i was, a young boy, my father, took me into the city, too see a marching band

//https://is-online-backend-herohamp.c9users.io:8080
