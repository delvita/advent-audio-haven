document.addEventListener('DOMContentLoaded', function() {
  const dropdownButton = document.querySelector('[data-dropdown-toggle]');
  const dropdownMenu = document.querySelector('[data-dropdown-menu]');

  if (dropdownButton && dropdownMenu) {
    dropdownButton.addEventListener('click', function() {
      dropdownMenu.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  }
});