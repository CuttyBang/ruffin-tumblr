$(document).ready(function($) {

  //utility object of variables
  var util = {
    clientKey: 'Vg4h8km8IR34NENUfGKQLHFusV8N3WkawLlQOqW8XVovuqD7JY',
    namedUrl: 'https://api.tumblr.com/v2/blog/',
    taggedUrl: 'http://api.tumblr.com/v2/tagged?tag=',
    htmlStart: '<li class="items"><input type="button" class="btn btn-default item-button" value="Add" /><h3>',
    bridge: '</h3><div class="each-item">',
    htmlEnd: '</div></li>',
  };

  //toastr options
  toastr.options.closeButton = true;

  //blog name AJAX function
  var getBlog = function() {
    var query = $('#blog-title').val();
    $.ajax({
      url: util.namedUrl + query + '.tumblr.com/posts/text',
      type: 'GET',
      dataType: 'jsonp',
      data: ({api_key: util.clientKey})
    })
    .done(function(info) {
      for (var i = 0; i<info.response.posts.length; i++) {
        var resp = info.response.posts[i];
        if (resp.length < 0) {
          toastr.error('I cannnot find anything worthwhile for that');
        }
        else if (resp !== undefined) {
          $('#list').append(util.htmlStart + resp.blog_name + util.bridge + '<h2>' + resp.title + '</h2>' + resp.body + util.htmlEnd);
        }
      }
    })
    .fail(function() {
      toastr.error("Wait a second! You need to check your spelling or something. It's me, not you. Promise...")
    });
    $('#blog-title').val('');
  };

  //tagged search AJAX function
  var getTags = function() {
    var query = $('#tags').val();
    $.ajax({
      url: util.taggedUrl + query,
      type: 'GET',
      dataType: 'jsonp',
      data: ({api_key: util.clientKey})
    })
    .done(function(info) {
      for (var i = 0; i<info.response.length; i++) {
        var resp = info.response[i];
        var htmlChain = util.htmlStart + resp.summary + util.bridge;
        if (resp.length < 1) {
          toastr.error('I cannnot find anything worthwhile for that');
        }
        else if (resp !== undefined) {
          if (resp.type == 'photo') {
            $('#list').append(htmlChain + '<img src="'+ resp.photos[0].original_size.url + '" width="400" height="400"></img>' + util.htmlEnd);
          }
          else if (resp.type == 'quote'){
            $('#list').append(htmlChain + '<p><em>"..' + resp.text + '.."</em></p>' + util.htmlEnd);
          }
          else if (resp.type == 'video'){
            $('#list').append(htmlChain + '<video src="' + resp.post_url + '" alt="cannot retrieve video"></video>' + util.htmlEnd);
          }
          else if (resp.type == 'answer'){
            $('#list').append(htmlChain + '<div>' + resp.text + '</div>' + util.htmlEnd);
          }
          else if (resp.type == 'link'){
            $('#list').append(htmlChain + '<a href="' + resp.url + '" target="_blank">' + util.htmlEnd);
          }
          else{
            $('#list').append(htmlChain + '<iframe width="500" height="400" src="' + resp.post_url + '" alt="cannot retrieve this item, sorry"></iframe>' + util.htmlEnd);
          }
        }
      }
    })
    .fail(function() {
      toastr.error('I do not think that word means what you think it means.');
    });
    $('#tags').val('');
  };

  //blog name with tags AJAX function
  var getTaggedBlog = function() {
    var blogName = $('#blog-title').val();
    var tags = $('#tags').val();
    $.ajax({
      url: util.namedUrl + blogName + '.tumblr.com/posts/?tag=' + tags,
      type: 'GET',
      dataType: 'jsonp',
      data: ({api_key: util.clientKey})
    })
    .done(function(info) {
      for (var i = 0; i<info.response.posts.length; i++) {
        var resp = info.response.posts[i];
        var htmlChain = util.htmlStart + resp.summary + util.bridge;
        if (resp !== undefined) {
          if (resp.type == 'photo') {
            $('#list').append(htmlChain + '<img src="'+ resp.photos[0].original_size.url + '" width="400" height="400"></img>' + util.htmlEnd);
          }
          else if (resp.type == 'quote'){
            $('#list').append(htmlChain + '<p><em>"..' + resp.text + '.."</em></p>' + util.htmlEnd);
          }
          else if (resp.type == 'video'){
            $('#list').append(htmlChain + '<video src="' + resp.post_url + '"></video>' + util.htmlEnd);
          }
          else if (resp.type == 'answer'){
            $('#list').append(htmlChain + '<div>' + resp.text + '</div>' + util.htmlEnd);
          }
          else if (resp.type == 'link'){
            $('#list').append(htmlChain + '<a href="' + resp.url + '" target="_blank">' + util.htmlEnd);
          }
          else{
            $('#list').append(htmlChain + '<iframe width="500" height="400" src="' + resp.post_url + '"></iframe>' + util.htmlEnd);
          }
        }
      }
    })
    .fail(function() {
      toastr.error('I think you should look at your entries. Maybe?');
    });
    $('#blog-title').val('');
    $('#tags').val('');
  };

  //button click handling - fires search
  $('#go').on('click', function() {
    $('#list').html('');
    if ($('#blog-title').val().trim() === '' && $('#tags').val().trim() === '') {
      toastr.error("I need there to be something to search for!");
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

  //return keystroke handling - fires search
  $(document).keypress(function(event) {
    if (event.which === 13) {
      $('#list').html('');
      if ($('#blog-title').val().trim() === '' && $('#tags').val().trim() === '') {
        toaster.error("I need there to be something to search for!");
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

  //result favoriting - handles click of "add" button and add it to favorites
  $('#list').on('click', 'input[type=button]', function(event) {
    event.preventDefault();
    $(this).parent().clone().appendTo('#fave-list').removeClass('items').addClass('fave-items');
    $('#fave-list input[type=button]').attr('value', 'Remove');
  });

  //"remove" button - handles click of button and removes item from favorites
  $('#fave-list').on('click', 'input[type=button]', function(event) {
    event.preventDefault();
    $(this).parent().remove();
  });

});
