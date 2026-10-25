document.addEventListener('DOMContentLoaded', function() {
  var filter = document.getElementById('post-tag-filter');
  var status = document.getElementById('post-filter-status');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.post-card'));

  if (!filter || !status || cards.length === 0) {
    return;
  }

  function updatePosts() {
    var selectedTag = filter.value;
    var visibleCount = 0;

    cards.forEach(function(card) {
      var tags = card.getAttribute('data-tags').split(',');
      var isVisible = selectedTag === 'all' || tags.indexOf(selectedTag) !== -1;

      card.hidden = !isVisible;
      if (isVisible) {
        visibleCount += 1;
      }
    });

    status.textContent = visibleCount + (visibleCount === 1 ? ' post' : ' posts') + ' shown';
  }

  filter.addEventListener('change', updatePosts);
  updatePosts();
});
