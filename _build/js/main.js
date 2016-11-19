$(document).ready(function($) {

  var util = {
    clientKey: 'Vg4h8km8IR34NENUfGKQLHFusV8N3WkawLlQOqW8XVovuqD7JY',
    namedUrl: 'https://api.tumblr.com/v2/blog/',
    taggedUrl: 'http://api.tumblr.com/v2/tagged?tag=',
    htmlStart: '<li class="items"><input type="button" class="btn btn-default item-button" value="Add" /><h3>',
    bridge: '</h3><div class="each-item">',
    htmlEnd: '</div></li>',
    chain: util.htmlStart + resp.summary + util.bridge,
  };

  toastr.options.closeButton = true;

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
        var htmlChain = util.htmlStart + resp.summary + util.bridge;
        if (resp !== undefined) {
          $('#list').append(util.chain + '<h2>' + resp.title + '</h2>' + resp.body + util.htmlEnd);
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
      url: util.taggedUrl + query,
      type: 'GET',
      dataType: 'jsonp',
      data: ({api_key: util.clientKey})
    })
    .done(function(info) {
      for (var i = 0; i<info.response.length; i++) {
        var resp = info.response[i];
        if (resp !== undefined) {
          if (resp.type == 'photo') {
            $('#list').append(util.chain + '<img src="'+ resp.photos[0].original_size.url + '" width="400" height="400"></img>' + htmlEnd);
          }
          else if (resp.type == 'quote'){
            $('#list').append(util.chain + '<p><em>"..' + resp.text + '.."</em></p>' + htmlEnd);
          }
          else if (resp.type == 'video'){
            $('#list').append(util.chain + '<video src="' + resp.post_url + '" alt="cannot retrieve video"></video>' + htmlEnd);
          }
          else if (resp.type == 'answer'){
            $('#list').append(util.chain + '<div>' + resp.text + '</div>' + htmlEnd);
          }
          else if (resp.type == 'link'){
            $('#list').append(util.chain + '<a href="' + resp.url + '" target="_blank">' + htmlEnd);
          }
          else{
            $('#list').append(util.chain + '<iframe width="500" height="400" src="' + resp.post_url + '" alt="cannot retrieve this item, sorry"></iframe>' + htmlEnd);
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
        if (resp !== undefined) {
          if (resp.type == 'photo') {
            $('#list').append(util.chain + '<img src="'+ resp.photos[0].original_size.url + '" width="400" height="400"></img>' + util.htmlEnd);
          }
          else if (resp.type == 'quote'){
            $('#list').append(util.chain + '<p><em>"..' + resp.text + '.."</em></p>' + util.htmlEnd);
          }
          else if (resp.type == 'video'){
            $('#list').append(util.chain + '<video src="' + resp.post_url + '"></video>' + util.htmlEnd);
          }
          else if (resp.type == 'answer'){
            $('#list').append(util.chain + '<div>' + resp.text + '</div>' + util.htmlEnd);
          }
          else if (resp.type == 'link'){
            $('#list').append(util.chain + '<a href="' + resp.url + '" target="_blank">' + util.htmlEnd);
          }
          else{
            $('#list').append(util.chain + '<iframe width="500" height="400" src="' + resp.post_url + '"></iframe>' + util.htmlEnd);
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
      toastr.error("I need there to be something to search for!")
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
        toaster.error("I need there to be something to search for!")
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
