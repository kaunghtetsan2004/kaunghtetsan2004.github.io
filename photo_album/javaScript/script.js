
window.onload = function () {

  // Calculate Days
  function calculateDay(startDate, elementId) {

    const today = new Date();
    const date = new Date(startDate);

    const diff = today.getTime() - date.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    document.getElementById(elementId).textContent = days;
  }

  // Calculate Age
  function calculateAge(startDate, elementId) {

    const today = new Date();
    const birthDate = new Date(startDate);

    let years = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      years--;
    }

    document.getElementById(elementId).textContent = years;
  }

  // Function Calls
  calculateDay('2024-08-22', 'days');

  calculateAge('2004-11-22', 'age');

  calculateAge('2001-12-02', 'ages');

};



