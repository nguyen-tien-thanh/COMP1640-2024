function toggleDropdownMenu(id) {
  const dropdownMenu = document.getElementById(`dropdown-${id}`);
  dropdownMenu.classList.toggle("hidden");
}

function toggleComment(id) {
  const replyBox = document.getElementById(`reply-${id}`);
  replyBox.classList.toggle("hidden");
}

function downloadDocument(fileName) {
  const downloadLink = document.createElement("a");
  downloadLink.href = `/uploads/${fileName}`;
  downloadLink.download = fileName;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function editContribution(id) {
  const contentElement = document.querySelector(`#content-${id}`);
  contentElement.contentEditable = true;
  contentElement.focus();
  toggleDropdownMenu(id);

  const btnSubmit = document.querySelector(`#btnSubmit-${id}`);
  btnSubmit.style.display = "block";

  const btnX = document.querySelectorAll(`.btnX-${id}`);
  btnX.forEach((btn) => (btn.style.display = "block"));
}

function removeFile(fileName) {
  const file = document.getElementById(fileName);
  file.style.display = "none";
  deletedFiles.push(fileName);
}

var deletedFiles = [];

function submitUpdate(id) {
  const content = document.querySelector(`#content-${id}`).innerText;
  const contentElement = document.querySelector(`#content-${id}`);
  const btnSubmit = document.querySelector(`#btnSubmit-${id}`);
  const btnX = document.querySelectorAll(`.btnX-${id}`);

  const requestBody = {
    deletedFiles,
    content,
  };

  fetch(`/contribution/update/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (response.ok) {
        btnX.forEach((btn) => (btn.style.display = "none"));
        btnSubmit.style.display = "none";
        contentElement.contentEditable = false;
      } else {
        alert("Failed to submit update");
      }
    })
    .catch((error) => {
      alert("Error submitting update:", error);
    });
}
