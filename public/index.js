const createForm = document.getElementById("create-form");
createForm.addEventListener("submit", () => {
  validateCreateForm();
});

function validateCreateForm() {
  const isbn = createForm["isbn"].value;
  const title = createForm["title"].value;
  const author = createForm["author"].value;
  const date = createForm["date_read"].value;
  const rating = createForm["rating"].value;
  //const about = createForm["about"].value;
  //const notes = createForm["notes"].value;

  if (isNaN(isbn)) {
    alert("ISBN must be a number.");
    return false;
  }

  if (isbn.trim() == "") {
    alert("ISBN must be a filled-in.");
    return false;
  }

  if (title.trim() == "") {
    alert("Title must be a filled-in.");
    return false;
  }

  if (author.trim() == "") {
    alert("Author must be a filled-in.");
    return false;
  }

  if (date.trim() == "") {
    alert("Date must be a filled-in.");
    return false;
  }

  if (isNaN(new Date(date))) {
    alert("Date must be in a valid format.");
    return false;
  }

  if (isNaN(rating)) {
    alert("Rating must be a number.");
    return false;
  }

  if (!(rating == parseInt(rating, 10))) {
    alert("Rating must be an Integer number.");
    return false;
  }

  if (parseInt(rating, 10) < 1 || parseInt(rating, 10) > 10) {
    alert("Rating must be a number from 1 to 10");
    return false;
  }
}
