$(document).ready(function(){

  //let's swap 'em videos
  $('body').click(function(e){
    
    if(!$(e.currentTarget).hasClass('js-font-switch')){
      videoSwap();
    }
  }); //end of video swapping on click in 'body'

  $('.js-font-switch').click(function(e){
    e.stopPropagation();
    fontUpdate();
  }); //end of font update calls

  $('.js-modal-trigger').click(function(e){
    openImageModal(e);
  });

  $('#modalPop').on('hidden.bs.modal', function(){
    $('.modal-content').empty();
  });

  $('.js-purchase-stock').on('click', function(e){
    e.preventDefault();
    $('#stockFormButton').addClass('hidden');
    $('#stockFormContainer').removeClass('hidden');
    $('#stockPurchaseSection').height($(window).height());
    $('#stockPurchaseSection').get(0).scrollIntoView();
  });

  $('#stockForm').submit(function(e){
    console.log( JSON.stringify($( this ).serializeArray()) );
    e.preventDefault();
    var form = this;
    $('.form-group', form).removeClass('has-error');
    $('.help-block', form).remove();
    $('.alert', form).remove();

    $.post(e.currentTarget.action, $( this ).serializeArray())
      .done(function(data){
        var data = jQuery.parseJSON(data);
        if(data.success){
          $(form).prepend('<div class="alert alert-success" role="alert">' + data.message + '</div>');
        }
        else {
          if(Object.keys(data.errors).length > 0){
            $.each(data.errors, function(key, value){
              console.log(key);
              console.log(value);
              console.log(form);
              $('#'+key, form)
                .parent('.form-group')
                .addClass('has-error')
                .append('<span class="help-block">' + value + '</span>');
            });
          }
          else {
            $(form).prepend('<div class="alert alert-danger" role="alert">An unknown error has occured. Please try again. Sorry.</div>');
          }
        }
      });
  });

  $('body').on('click', '.js-modal-update', function(e){
    updateImageModal(e);
  });
});

var videoSwap = function(){
  var vContainer = $('.video-container');
  var vSource = $('source', vContainer).attr('src');
  vSource = vSource.slice(vSource.lastIndexOf("/") + 1, vSource.lastIndexOf("."));
  $('video', vContainer).get(0).pause();

  $.getJSON('site-data.json', function (data) {
    var videos = data[0].videos;
    switch (vSource){
      case videos.videoOne:
        videoSourceUpdate(vContainer, videos.videoTwo);
        break;
      case videos.videoTwo:
        videoSourceUpdate(vContainer, videos.videoThree);
        break;
      case videos.videoThree:
        videoSourceUpdate(vContainer, videos.videoOne);
        break;
      default:
        videoSourceUpdate(vContainer, videos.videoOne);
        break;
    }
    $('video', vContainer).get(0).load();
    $('video', vContainer).get(0).play();
  });
}

var openImageModal = function(event){
  event.preventDefault();
  var city = $(event.currentTarget).attr("id");
  $.getJSON('site-data.json', function (data) {
    var images = data[0].images[city];
    $('.modal-content').append('<img src="assets/images/'+city+'/'+images[0]+'" alt="'+city+'">');
    if(images.length > 1) {
      window.displayImages = images;
      $('.modal-content').append('<button class="next-image js-modal-update" data-reference="'+images[1]+'"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></button>')
    }

    $('#modalPop').modal('show');
  });
}

var updateImageModal = function(event){
  var newImage = $(event.currentTarget).data('reference');
  var imagePosition = window.displayImages.indexOf(newImage);
  //update the next button
  if(window.displayImages.length > imagePosition+1){
    if($('.next-image').length == 0) {
      $('.modal-content').append('<button class="next-image js-modal-update" data-reference="'+window.displayImages[imagePosition+1]+'"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></button>');
    }
    else {
      $('.next-image').data('reference', window.displayImages[imagePosition+1]);
    }
  }
  else {
    $('.next-image').remove();
  }
  //update the previous button
  if((imagePosition-1) >= 0){
    if($('.prev-image').length == 0) {
      $('.modal-content').append('<button class="prev-image js-modal-update" data-reference="'+window.displayImages[imagePosition-1]+'"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span></button>');
    }
    else {
      $('.prev-image').data('reference', window.displayImages[imagePosition-1]);
    }
  }
  else {
    $('.prev-image').remove();
  }
  var city = $('img', '.modal-content').attr('alt');
  $('img', '.modal-content').attr('src', 'assets/images/'+city+'/'+newImage);
}

var videoSourceUpdate = function(vContainer, newVideo){
  $('source', vContainer).each(function(){
    if($(this).attr('type') == "video/webm"){
      $(this).attr('src', 'assets/videos/'+newVideo+'.webm')
    }
    if($(this).attr('type') == "video/mp4"){
      $(this).attr('src', 'assets/videos/'+newVideo+'.mp4')
    }
  })
}

var fontUpdate = function(){
  if($('.js-font-switch').hasClass('osaka')){
    $('.js-font-switch').addClass('bodoni').removeClass('osaka');
    var textNodes = textNodesUnder(document.body);
    textNodes.forEach(function(textNode){
      textNode.textContent = textNode.prevTextContent;
    });
  }
  else if ($('.js-font-switch').hasClass('bodoni')) {
    $('.js-font-switch').addClass('baskerville').removeClass('bodoni');
  }
  else if ($('.js-font-switch').hasClass('baskerville')) {
    $('.js-font-switch').addClass('osaka').removeClass('baskerville');
    var textNodes = textNodesUnder(document.body);
    textNodes.forEach(function(textNode){
      textNode.prevTextContent = textNode.textContent;
      var charArray = textNode.textContent.split("");
      charArray.forEach(function(char, i){
        if(char != " "){
          charArray[i] = String.fromCharCode(0x30A0 + Math.random() * (0x30FF-0x30A0+1));
        }
      });
      textNode.textContent = charArray.join("");
    });
  }
  else {
    $('.js-font-switch').addClass('baskerville');
  }
}

var textNodesUnder = function(el){
  var n, a=[], c, walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);

  while(n=walk.nextNode()){
    if(n.textContent.replace(/(\r\n|\n|\r)\s+/g, "").length){
      a.push(n);
    }
  }
  return a;
}
