let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let history = JSON.parse(localStorage.getItem('history')) || [];

window.onload = () => {
    renderTasks();
    renderHistory();
};

function formatDate(dateString) {
    if (!dateString) return "Sem data";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

function addTask() {
    const titleInput = document.getElementById('taskTitle');
    const descInput = document.getElementById('taskDesc');
    const dateInput = document.getElementById('taskDate');
    const fileInput = document.getElementById('taskFile');

    if (titleInput.value.trim() === "") {
        alert("Por favor, digite um título!");
        return;
    }

    let fileURL = "";
    let fileName = "";
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName = file.name;
        fileURL = URL.createObjectURL(file);
    }

    const newTask = {
        id: Date.now(),
        title: titleInput.value,
        description: descInput.value,
        date: dateInput.value,
        fileName: fileName,
        fileURL: fileURL,
        completed: false
    };

    tasks.push(newTask);
    saveData();
    
    titleInput.value = "";
    descInput.value = "";
    dateInput.value = "";
    fileInput.value = "";

    renderTasks();
}

function renderTasks(data = tasks) {
    const list = document.getElementById('taskList');
    if (!list) return;
    list.innerHTML = "";

    data.forEach(task => {
        const li = document.createElement('li');
        li.className = "task-item";

        const fileBtn = task.fileURL 
            ? `<div class="file-box">
                 <a href="${task.fileURL}" target="_blank" class="btn-view-file">
                    👁️ Ver Arquivo: ${task.fileName}
                 </a>
               </div>` 
            : '';

        li.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description || '<i>Sem observações</i>'}</p>
                <small>📅 Prazo: ${formatDate(task.date)}</small>
                ${fileBtn}
            </div>
            <button onclick="completeTask(${task.id})">Concluir</button>
        `;
        list.appendChild(li);
    });

    updateProgress();
}

function completeTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    const completedTask = tasks.splice(index, 1)[0];
    history.push(completedTask);
    saveData();
    renderTasks();
    renderHistory();
}

function renderHistory() {
    const hList = document.getElementById('historyList');
    if (!hList) return;
    hList.innerHTML = "";
    history.forEach(task => {
        const li = document.createElement('li');
        li.className = "task-item";
        li.innerHTML = `<div class="task-info"><h3><del>${task.title}</del></h3></div>`;
        hList.appendChild(li);
    });
}

function updateProgress() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    const total = tasks.length + history.length;
    const percentage = total === 0 ? 0 : Math.round((history.length / total) * 100);
    bar.style.width = percentage + "%";
    bar.innerText = percentage + "%";
}

function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('history', JSON.stringify(history));
}

function searchTasks() {
    const text = document.getElementById('searchInput').value.toLowerCase();
    const filtered = tasks.filter(t => t.title.toLowerCase().includes(text));
    renderTasks(filtered);
}

function clearHistory() {
    if (confirm("Deseja realmente apagar todo o histórico de tarefas?")) {
        
        history = [];

        saveData();

        renderHistory();
        
        updateProgress();
    }
}

function updateFileName() {
    const input = document.getElementById('taskFile');
    const display = document.getElementById('fileNameDisplay');
    if (input.files.length > 0) {
        display.innerText = input.files[0].name;
    } else {
        display.innerText = "Nenhum arquivo...";
    }
}

function sortByDate() {
    tasks.sort((a, b) => {
        if (!a.date) return 1; 
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
    });

    saveData();

    renderTasks();
}