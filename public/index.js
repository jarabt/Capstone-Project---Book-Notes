function validateForm() {
  let isbn = document.forms[0]["isbn"].value;
  let title = document.forms[0]["title"].value;
  let author = document.forms[0]["author"].value;
  let date = document.forms[0]["date_read"].value;
  let rating = document.forms[0]["rating"].value;
  //let about = document.forms[0]["about"].value;
  //let notes = document.forms[0]["notes"].value;

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
