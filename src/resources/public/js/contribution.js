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
