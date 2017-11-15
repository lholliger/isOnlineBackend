Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


function verify(username, id, callback) { // after an hour of work i got this terrible API to work
    requestify.get('https://scratch.mit.edu/site-api/comments/gallery/4100062/?page=1').then(function(response) {
        var what_is_this = response.getBody();
        var barely_more_decent_but_still_what_is_this = what_is_this.replaceAll(" ", "");
        barely_more_decent_but_still_what_is_this = barely_more_decent_but_still_what_is_this.replaceAll("\n", "");
        if (barely_more_decent_but_still_what_is_this.includes(username + '</a></div><divclass="content">' + id)) {
            callback(true);
        }
        else {
            callback(false);
        }


    });
}
