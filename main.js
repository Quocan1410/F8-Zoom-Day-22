const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const addBtn = $(".add-btn");
const formAdd = $("#addTaskModal");
const modalClose = $(".modal-close");
const btnCancel = $(".btn-cancel");
const todoForm = $(".todo-app-form");
const titleInput = $("#taskTitle");

// Origin: scheme (https, http) + hostname/IP/domain + port

function closeForm() {
    formAdd.className = "modal-overlay";
    todoForm.reset(); // Reset lại form khi đóng modal
}

function openForm() {
    formAdd.className = "modal-overlay show";
    setTimeout(() => {
        titleInput.focus(); // Đặt con trỏ vào ô nhập tiêu đề khi mở modal
    }, 100); // Đợi 100ms để modal hiển thị trước khi đặt con trỏ
}

openForm();

addBtn.onclick = openForm; // Mở modal khi nhấn nút "Thêm mới"

// Xử lý đống modal "Thêm mới"
modalClose.onclick = closeForm;
btnCancel.onclick = closeForm;

const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];

// Xử lý khi form submit
todoForm.onsubmit = function (e) {
    e.preventDefault();

    // Lấy toàn bộ form data (dữ liệu từ các input, textarea, ...)
    const newTask = Object.fromEntries(new FormData(todoForm));
    newTask.isCompleted = false; // Mặc định chưa hoàn thành

    // Thêm task mới vào đầu mảng
    todoTasks.unshift(newTask);

    // Lưu toàn bộ danh sách task vào localStorage
    localStorage.setItem("todoTasks", JSON.stringify(todoTasks));

    closeForm(); // Đóng modal

    renderTasks(todoTasks); // Cập nhật lại giao diện
};

function renderTasks(tasks) {
    const html = tasks
        .map(
            (task) => `
    <div class="task-card ${task.color}  ${task.isCompleted ? "completed" : ""}">
                    <div class="task-header">
                        <h3 class="task-title">${task.title}</h3>
                        <button class="task-menu">
                            <i class="fa-solid fa-ellipsis fa-icon"></i>
                            <div class="dropdown-menu">
                                <div class="dropdown-item">
                                    <i class="fa-solid fa-pen-to-square fa-icon"></i>
                                    Edit
                                </div>
                                <div class="dropdown-item complete">
                                    <i class="fa-solid fa-check fa-icon"></i>
                                    Mark as Active
                                    ${task.isCompleted ? "Mark as Active" : "Mask as Complete"}
                                </div>
                                <div class="dropdown-item delete">
                                    <i class="fa-solid fa-trash fa-icon"></i>
                                    Delete
                                </div>
                            </div>
                        </button>
                    </div>
                    <p class="task-description">${task.description}</p>
                    <div class="task-time">${task.startTime} - ${task.endTime}</div>
                </div>`
        )
        .join("");

    const todoList = $("#todoList");
    todoList.innerHTML = html;
}

// Render lần đầu, để hiển thị được danh sách task đã lưu trong localStorage
renderTasks(todoTasks);
