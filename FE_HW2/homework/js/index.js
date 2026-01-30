const userList = document.querySelector(".user-list");
const editForm = document.getElementById("edit-form");
const form = document.getElementById("form");
const spinner = document.getElementById("spinner");

let currentUserCard = null;

function showSpinner() {
  spinner.classList.remove("hidden");
}

function hideSpinner() {
  spinner.classList.add("hidden");
}

function createUserCard(user) {
  const card = document.createElement("div");
  card.className = "user-card";
  card.dataset.id = user.id;

  card.innerHTML = `
    <div class="user-name">${user.name}</div>
    <div class="user-username">@${user.username}</div>
    <div class="card-footer">
      <div>phone: ${user.phone}</div>
      <div>website: ${user.website}</div>
      <div>email: ${user.email}</div>
    </div>
    <div class="card-actions">
      <button class="edit-btn">EDIT</button>
      <button class="delete-btn">DELETE</button>
    </div>
  `;

  // EDIT
  card.querySelector(".edit-btn").addEventListener("click", () => {
    currentUserCard = card;
    form.name.value = user.name;
    form.username.value = user.username;
    form.phone.value = user.phone;
    form.website.value = user.website;
    form.email.value = user.email;
    editForm.classList.remove("hidden");

    editForm.classList.add("show");
    editForm.classList.remove("hidden");
  });

  // DELETE
  card.querySelector(".delete-btn").addEventListener("click", () => {
    const id = card.dataset.id;
    showSpinner();
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        card.remove();
      })
      .finally(() => hideSpinner());
  });

  userList.appendChild(card);
}

// GET
function loadUsers() {
  showSpinner();
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((users) => {
      users.forEach((user) => createUserCard(user));
    })
    .finally(() => hideSpinner());
}

// UPDATE
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = currentUserCard.dataset.id;
  const updated = {
    name: form.name.value,
    username: form.username.value,
    phone: form.phone.value,
    website: form.website.value,
    email: form.email.value,
  };

  showSpinner();
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  })
    .then((res) => res.json())
    .then((data) => {
      currentUserCard.querySelector(".user-name").textContent = data.name;
      currentUserCard.querySelector(
        ".user-username"
      ).textContent = `@${data.username}`;
      currentUserCard.querySelector(
        ".card-footer div:nth-child(1)"
      ).textContent = `phone: ${data.phone}`;
      currentUserCard.querySelector(
        ".card-footer div:nth-child(2)"
      ).textContent = `website: ${data.website}`;
      currentUserCard.querySelector(
        ".card-footer div:nth-child(3)"
      ).textContent = `email: ${data.email}`;
      editForm.classList.add("hidden");
    })
    .finally(() => hideSpinner());
});

loadUsers();
