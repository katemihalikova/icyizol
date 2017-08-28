~function() {
  'use strict';

  var mBtn = document.querySelector('.menubutton');
  var navList = document.querySelector('.navlist');
  mBtn.addEventListener('click', function() {
    navList.classList.toggle('is-open');
  });

  $('[gallery]').each(function(i) {
    $('a', this).attr('rel', 'i' + i);
  });
  $('[gallery] a:has(img)').swipebox({
    hideBarsDelay: 0,
  });
  $('[more]').on('click', function(e) {
    e.preventDefault();
    $($(this).hide().attr('more')).show();
  });
}();
