$(document).ready(function($) {
  var clientKey = 'Vg4h8km8IR34NENUfGKQLHFusV8N3WkawLlQOqW8XVovuqD7JY';
  var namedUrl = 'https://api.tumblr.com/v2/blog/';
  var tagged = 'http://api.tumblr.com/v2/tagged?tag=';
  var htmlStart = '<li class="items"><h3>';
  var bridge = '</h3><div class="each-item">';
  var htmlEnd = '</div><input type="button" class="btn btn-default item-button" value="Add" /></li>';
  toastr.options.closeButton = true;

  var getBlog = function() {
    var query = $('#blog-title').val();
    $.ajax({
      url: namedUrl + query + '.tumblr.com/posts/text',
      type: 'GET',
      dataType: 'jsonp',
      data: ({api_key: clientKey})
    })
    .done(function(info) {
      for (var i = 0; i<info.response.posts.length; i++) {
        var items = info.response.posts[i];
        if (items !== undefined) {
          $('#list').append(htmlStart + items.blog_name + bridge + '<h2>' + items.title + '</h2>' + items.body + htmlEnd);
        }
      }
    })
    .fail(function() {
      toastr.error("Wait a second! You need to check your spelling or something. It's me, not you. Promise...")
    });
    $('#blog-title').val('');
  };

  var getTags = function() {
    var query = $('#tags').val();
    $.ajax({
      url: tagged + query,
      type: 'GET',
      dataType: 'jsonp',
      data: ({api_key: clientKey})
    })
    .done(function(info) {
      for (var i = 0; i<info.response.length; i++) {
        var items = info.response[i];
        if (items !== undefined) {
          if (items.type == 'photo') {
            $('#list').append(htmlStart + items.summary + bridge + '<img src="'+ items.photos[0].original_size.url + '" width="400" height="400"></img>' + htmlEnd);
          }
          else if (items.type == 'quote'){
            $('#list').append(htmlStart + items.summary + bridge + '<p><em>"..' + items.text + '.."</em></p>' + htmlEnd);
          }
          else if (items.type == 'video'){
            $('#list').append(htmlStart + items.summary + bridge + '<video src="' + items.post_url + '" alt="cannot retrieve video"></video>' + htmlEnd);
          }
          else if (items.type == 'answer'){
            $('#list').append(htmlStart + items.summary + bridge + '<div>' + items.text + '</div>' + htmlEnd);
          }
          else if (items.type == 'link'){
            $('#list').append(htmlStart + items.summary + bridge + '<a href="' + items.url + '" target="_blank">' + htmlEnd);
          }
          else{
            $('#list').append(htmlStart + items.summary + bridge + '<iframe width="500" height="400" src="' + items.post_url + '" alt="cannot retrieve this item, sorry"></iframe>' + htmlEnd);
          }
        }
      }
    })
    .fail(function() {
      toastr.error('I do not think that word means what you think it means.')
    });
    $('#tags').val('');
  };

  var getTaggedBlog = function() {
    var blogName = $('#blog-title').val();
    var tagged = $('#tags').val();
    $.ajax({
      url: namedUrl + blogName + '.tumblr.com/posts/?tag=' + tagged,
      type: 'GET',
      dataType: 'jsonp',
      data: ({api_key: clientKey})
    })
    .done(function(info) {
      for (var i = 0; i<info.response.posts.length; i++) {
        var items = info.response.posts[i];
        if (items !== undefined) {
          if (items.type == 'photo') {
            $('#list').append(htmlStart + items.summary + bridge + '<img src="'+ items.photos[0].original_size.url + '" width="400" height="400"></img>' + htmlEnd);
          }
          else if (items.type == 'quote'){
            $('#list').append(htmlStart + items.summary + bridge + '<p><em>"..' + items.text + '.."</em></p>' + htmlEnd);
          }
          else if (items.type == 'video'){
            $('#list').append(htmlStart + items.summary + bridge + '<video src="' + items.post_url + '" alt="cannot retrieve video"></video>' + htmlEnd);
          }
          else if (items.type == 'answer'){
            $('#list').append(htmlStart + items.summary + bridge + '<div>' + items.text + '</div>' + htmlEnd);
          }
          else if (items.type == 'link'){
            $('#list').append(htmlStart + items.summary + bridge + '<a href="' + items.url + '" target="_blank">' + htmlEnd);
          }
          else{
            $('#list').append(htmlStart + items.summary + bridge + '<iframe width="500" height="400" src="' + items.post_url + '" alt="cannot retrieve this item, sorry"></iframe>' + htmlEnd);
          }
        }
      }
    })
    .fail(function() {
      toastr.error('I think you should look at your entries. Maybe?')
    });
    $('#blog-title').val('');
    $('#tags').val('');
  };

  $('#go').on('click', function() {
    $('#list').html('');
    if ($('#blog-title').val().trim() === '' && $('#tags').val().trim() === '') {
      alert("I need there to be something to search for!")
    }
    else if ($('#tags').val().trim() === '') {
      getBlog();
    }
    else if ($('#blog-title').val().trim() === '') {
      getTags();
    }
    else {
      getTaggedBlog();
    }
  });

  $(document).keypress(function(event) {
    if (event.which === 13) {
      $('#list').html('');
      if ($('#blog-title').val().trim() === '' && $('#tags').val().trim() === '') {
        alert("I need there to be something to search for!")
      }
      else if ($('#tags').val().trim() === '') {
        getBlog();
      }
      else if ($('#blog-title').val().trim() === '') {
        getTags();
      }
      else {
        getTaggedBlog();
      }
    }
  });

  $('#list').on('click', 'input[type=button]', function(event) {
    event.preventDefault();
    $(this).parent().clone().appendTo('#fave-list').removeClass('items').addClass('fave-items');
    $('#fave-list input[type=button]').attr('value', 'Remove');
  });

  $('#fave-list').on('click', 'input[type=button]', function(event) {
    event.preventDefault();
    $(this).parent().remove();
  });

});
