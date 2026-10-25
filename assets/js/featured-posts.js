document.addEventListener('DOMContentLoaded', function() {
  var carousel = document.getElementById('featured-posts-carousel');

  if (carousel && window.jQuery && jQuery.fn.carousel) {
    jQuery(carousel).carousel();
  }
});