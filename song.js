const form = document.getElementById('songForm');

form.addEventListener('submit', () => {
  setTimeout(() => {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('successSection').style.display = 'block';
    form.reset();
  }, 400);
});