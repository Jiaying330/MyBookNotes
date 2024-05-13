var newNoteForm = 0;
var deleteModal = 0;
var editNoteForm = 0;

document.querySelectorAll(".note-delete-button").forEach(button => {
    button.addEventListener("click",  () => openDeleteModal(button));
});

document.querySelectorAll(".note-edit-button").forEach(button => {
    button.addEventListener("click",  () => openEditNoteForm(button));
});

function openNewNoteForm() {
    if (newNoteForm > 0) return;
    var form = document.getElementById("new-note-popup");
    form.style.display = "block";
}
function closeNewNoteForm() {
    newNoteForm -= 1;
    var form = document.getElementById("new-note-popup");
    form.style.display = "none";
}

function openEditNoteForm(button) {
    console.log("in openEditNoteForm " + editNoteForm);
    if (editNoteForm > 0) return;
    editNoteForm += 1;

    note_id = button.getAttribute("data-note_id");
    note_index = parseInt(button.getAttribute("data-note-index"));
    note_content = button.getAttribute("data-note-content");

    var div = document.getElementById("edit-note-popup");
    var form = div.querySelector("form");
    form.setAttribute("action", "/note/edit/" + note_id); 

    var textArea = div.querySelector("textarea");
    textArea.textContent = note_content;
    console.log(div);
    div.style.display = "block";
}

function closeEditNoteForm() {
    editNoteForm -= 1;
    var form = document.getElementById("edit-note-popup");
    form.style.display = "none";
}

function openDeleteModal(button) {
    if (deleteModal > 0) return;
    deleteModal += 1;
    note_id = button.getAttribute("data-note_id");
    var modal = document.getElementById("delete-modal-popup");
    var form = modal.querySelector('form.delete-popup');
    form.setAttribute("action", "/note/delete/" + note_id);
    console.log(form);
    modal.style.display = "block";
}

function closeDeleteModal() {
    deleteModal -= 1;
    var modal = document.getElementById("delete-modal-popup");
    modal.style.display = "none";
}

function closeAllForms() {
    closeNewNoteForm();
}