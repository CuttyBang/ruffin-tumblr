$(document).ready(function($) {
  var clientKey = 'Vg4h8km8IR34NENUfGKQLHFusV8N3WkawLlQOqW8XVovuqD7JY';
  var namedUrl = 'https://api.tumblr.com/v2/blog/';
  var tagged = 'http://api.tumblr.com/v2/tagged?tag='
  var myArr = [];

  var getBlog = function(){
    var query = $('#blog-title').val();
    $.ajax({
      url: namedUrl + query + '.tumblr.com/posts/text',
      type: 'GET',
      dataType: 'jsonp',
      data: ({ api_key: clientKey})
    })
    .done(function(info) {
      for(var i = 0; i<info.response.posts.length; i++){
        var items = info.response.posts[i];
        if(items !== undefined){
          $('#list').append('<li class="items"><div class="each-item"><h3>' + items.title + '</h3>' + items.body + '</div><button class="btn btn-default item-button">Save</button></li>')
        }
      }
    })
    .fail(function() {
      alert("Sorry, I couldn't find that, please check your search");
    });
  };

  var getTags = function(){
    var query = $('#tags').val();
    $.ajax({
      url: tagged + query,
      type: 'GET',
      dataType: 'jsonp',
      data: ({ api_key: clientKey})
    })
    .done(function(info) {
      for(var i = 0; i<info.response.length; i++){
        var items = info.response[i].photos[0].original_size.url;
        if(items !== undefined){
          $('#list').append('<li class="items"><div class="each-item"><img src="'+ items + '" width="400" height="400"></img></div><button class="btn btn-default item-button">Save</button></li>');
        }
      }
    })
    .fail(function() {
      alert("Sorry, I couldn't find that, please check your search");
    });
  };

  var getTaggedBlog = function(){
    var blogName = $('#blog-title').val();
    var tagged = $('#tags').val();
    $.ajax({
      url: namedUrl + blogName + '.tumblr.com/posts/?tag=' + tagged,
      type: 'GET',
      dataType: 'jsonp',
      data: ({ api_key: clientKey})
    })
    .done(function(info) {
      for(var i = 0; i<info.response.posts.length; i++){
        var items = info.response.posts[i];
        if(items !== undefined){
          if(items.type == 'photo'){
            $('#list').append('<li class="items"><h3>' + items.summary + '</h3><div class="each-item"><img src="'+ items.photos[0].original_size.url + '" width="400" height="400"></img></div><button class="btn btn-default item-button">Save</button></li>');
          }
          else if (items.type == 'quote'){
            $('#list').append('<li class="items"><h3>' + items.summary + '</h3><div class="each-item"><p><em>"..' + items.text + '.."</em></p></div><button class="btn btn-default item-button">Save</button></li>');
          }
          else if (items.type == 'video'){
            $('#list').append('<li class="items"><h3>' + items.summary + '</h3><div class="each-item"><video src=">' + items.post_url + '" alt"cannot retrieve video"></video></div><button class="btn btn-default item-button">Save</button></li>');
          }
          else if (items.type == 'answer'){
            $('#list').append('<li class="items"><h3>' + items.summary + '</h3><div class="each-item"><div>' + items.text + '</div</div><button class="btn btn-default item-button">Save</button></li>');
          }else if (items.type == 'link'){
            $('#list').append('<li class="items"><h3>' + items.summary + '</h3><div class="each-item"><a href="' + items.url + '" target="_blank"></div</div><button class="btn btn-default item-button">Save</button></li>');
          }else{
            $('#list').append('<li class="items"><h3>' + items.summary + '</h3><div class="each-item"><iframe width="500" height="400" src="' + items.post_url + '"></div</div><button class="btn btn-default item-button">Save</button></li>');
          }
        }
      }
    })
    .fail(function() {
      alert("Sorry, I couldn't find that, please check your search");
    });
  };


  $('#go').on('click', function(){
    $('#list').html('');
    if($('#blog-title').val().trim() === '' && $('#tags').val().trim() === ''){
      alert("I need there to be something to search for!")
    }
    else if($('#tags').val().trim() === ''){
      getBlog();
    }
    else if($('#blog-title').val().trim() === ''){
      getTags();
    }else{
      getTaggedBlog();
    }
  });

  $(this).on('click', '.item-button', function(event) {
    event.preventDefault();
    $('ul#list li').clone().appendTo('#fave-list');
  });


});
