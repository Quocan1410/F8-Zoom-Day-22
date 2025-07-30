const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const addBtn = $(".add-btn");
const formAdd = $("#addTaskModal");
const modalClose = $(".modal-close");
const btnCancel = $(".btn-cancel");
const todoForm = $(".todo-app-form");
const titleInput = $("#taskTitle");

// Khởi tạo mảng todoTasks
let todoTasks = [];

// Hàm đóng modal
function closeForm() {
    formAdd.className = "modal-overlay";
    todoForm.reset(); // Reset lại form khi đóng modal
}

// Hàm mở modal
function openForm() {
    formAdd.className = "modal-overlay show";
    setTimeout(() => {
        titleInput.focus(); // Đặt con trỏ vào ô nhập tiêu đề khi mở modal
    }, 100); // Đợi 100ms để modal hiển thị trước khi đặt con trỏ
}

// Xử lý sự kiện mở modal
addBtn.onclick = openForm;

// Xử lý đóng modal
modalClose.onclick = closeForm;
btnCancel.onclick = closeForm;

// Đóng modal khi click vào overlay
formAdd.onclick = function (e) {
    if (e.target === formAdd) {
        closeForm();
    }
};

// Xử lý khi form submit
todoForm.onsubmit = function (e) {
    e.preventDefault();

    // Lấy toàn bộ form data (dữ liệu từ các input, textarea, ...)
    const formData = new FormData(todoForm);
    const newTask = Object.fromEntries(formData);
    newTask.isCompleted = false; // Mặc định chưa hoàn thành

    // Thêm task mới vào đầu mảng
    todoTasks.unshift(newTask);

    closeForm(); // Đóng modal
    renderTasks(todoTasks); // Cập nhật lại giao diện
};

// Hàm render tasks ra giao diện
function renderTasks(tasks) {
    const todoList = $("#todoList");

    if (!tasks.length) {
        todoList.innerHTML = `
            <p>Chưa có công việc nào.</p>
        `;
        return;
    }

    const html = tasks
        .map(
            (task, index) => `
            <div class="task-card ${task.color} ${task.isCompleted ? "completed" : ""}" data-index="${index}">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <button class="task-menu" onclick="toggleDropdown(event, ${index})">
                        <i class="fa-solid fa-ellipsis fa-icon"></i>
                        <div class="dropdown-menu" id="dropdown-${index}">
                            <div class="dropdown-item" onclick="editTask(${index})">
                                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                                Edit
                            </div>
                            <div class="dropdown-item complete" onclick="toggleComplete(${index})">
                                <i class="fa-solid fa-check fa-icon"></i>
                                ${task.isCompleted ? "Mark as Active" : "Mark as Complete"}
                            </div>
                            <div class="dropdown-item delete" onclick="deleteTask(${index})">
                                <i class="fa-solid fa-trash fa-icon"></i>
                                Delete
                            </div>
                        </div>
                    </button>
                </div>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ""}
                ${task.startTime && task.endTime ? `<div class="task-time">${task.startTime} - ${task.endTime}</div>` : ""}
            </div>
        `
        )
        .join("");

    todoList.innerHTML = html;
}

// Hàm toggle dropdown menu
function toggleDropdown(event, index) {
    event.stopPropagation();
    const dropdown = $(`#dropdown-${index}`);
    const allDropdowns = $$(".dropdown-menu");

    // Đóng tất cả dropdown khác
    allDropdowns.forEach((menu) => {
        if (menu !== dropdown) {
            menu.classList.remove("show");
        }
    });

    // Toggle dropdown hiện tại
    dropdown.classList.toggle("show");
}

// Hàm toggle trạng thái complete
function toggleComplete(index) {
    todoTasks[index].isCompleted = !todoTasks[index].isCompleted;
    renderTasks(todoTasks);
    closeAllDropdowns();
}

// Hàm xóa task
function deleteTask(index) {
    if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
        todoTasks.splice(index, 1);
        renderTasks(todoTasks);
    }
    closeAllDropdowns();
}

// Hàm edit task (placeholder)
function editTask(index) {
    alert("Chức năng chỉnh sửa sẽ bổ sung sau!");
    closeAllDropdowns();
}

// Hàm đóng tất cả dropdown
function closeAllDropdowns() {
    $$(".dropdown-menu").forEach((menu) => {
        menu.classList.remove("show");
    });
}

// Đóng dropdown khi click ra ngoài
document.addEventListener("click", closeAllDropdowns);

// Render lần đầu, để hiển thị được danh sách task đã lưu trong localStorage
renderTasks(todoTasks);
