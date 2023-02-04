
var app = new Vue({ 
    el: '#tagStrips',
    data: {
       tagStrips: []
    }
});


$.getJSON('tagData.json', function (json) {
    app.tagStrips = json;

    console.log(app.tagStrips);

});