/* ── MAIN.JS — Initsialiseerimine (quiz.ejs) ── */

document.addEventListener('DOMContentLoaded', () => {
  const verified = sessionStorage.getItem('userEmail');
  if (!verified) {
    window.location.href = '/access';
    return;
  }

  goTo('screen-intro1');
});