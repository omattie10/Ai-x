document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const addTaskBtn = document.getElementById('add-task');
    const newTaskInput = document.getElementById('new-task');
    const tasksList = document.getElementById('tasks-list');
    const saveNoteBtn = document.getElementById('save-note');
    const newNoteInput = document.getElementById('new-note');
    const notesList = document.getElementById('notes-list');
    const timezoneSelect = document.getElementById('timezone-select');
    const timeDisplay = document.getElementById('time-display');
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const remindersList = document.getElementById('reminders-list');

    const setCookie = (name, value, days) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    };

    const getCookie = (name) => {
        return document.cookie.split('; ').reduce((r, v) => {
            const parts = v.split('=');
            return parts[0] === name ? decodeURIComponent(parts[1]) : r;
        }, '');
    };

    const checkCookies = () => {
        if (!getCookie('cookiesAccepted')) {
            cookieConsent.style.display = 'block';
        } else {
            cookieConsent.style.display = 'none';
        }
    };

    const acceptCookies = () => {
        setCookie('cookiesAccepted', 'true', 365);
        cookieConsent.style.display = 'none';
    };

    const theme = getCookie('theme') || 'dark';
    if (theme === 'light') {
        document.body.classList.remove('dark-theme');
    }

    const timezone = getCookie('timezone') || 'Europe/London';
    if (timezoneSelect) {
        timezoneSelect.value = timezone;
    }

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];

    const renderTasks = () => {
        if (!tasksList) return;
        tasksList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.textContent = task;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            });
            li.appendChild(deleteBtn);
            tasksList.appendChild(li);
        });
    };

    const renderNotes = () => {
        if (!notesList) return;
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const li = document.createElement('li');
            li.textContent = note;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                notes.splice(index, 1);
                localStorage.setItem('notes', JSON.stringify(notes));
                renderNotes();
            });
            li.appendChild(deleteBtn);
            notesList.appendChild(li);
        });
    };

    const renderReminders = () => {
        if (!remindersList) return;
        remindersList.innerHTML = '';
        reminders.forEach((reminder, index) => {
            const li = document.createElement('li');
            li.textContent = `${new Date(reminder.date).toDateString()}: ${reminder.text}`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                reminders.splice(index, 1);
                localStorage.setItem('reminders', JSON.stringify(reminders));
                renderReminders();
            });
            li.appendChild(deleteBtn);
            remindersList.appendChild(li);
        });
    };

    const updateTime = () => {
        if (!timezoneSelect || !timeDisplay) return;
        const timezone = timezoneSelect.value;
        const now = new Date();
        const timeInZone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        timeDisplay.textContent = timeInZone.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    if (timezoneSelect) {
        timezoneSelect.addEventListener('change', () => {
            const selectedTimezone = timezoneSelect.value;
            setCookie('timezone', selectedTimezone, 365);
            updateTime();
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
            setCookie('theme', theme, 365);
        });
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            const task = newTaskInput.value.trim();
            if (task) {
                tasks.push(task);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                newTaskInput.value = '';
                renderTasks();
            }
        });
    }

    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', () => {
            const note = newNoteInput.value.trim();
            if (note) {
                notes.push(note);
                localStorage.setItem('notes', JSON.stringify(notes));
                newNoteInput.value = '';
                renderNotes();
            }
        });
    }

    if (!getCookie('cookiesAccepted') && acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            acceptCookies();
        });
    }

    renderTasks();
    renderNotes();
    renderReminders();
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
    checkCookies();
});

document.getElementById('cookie-consent').style.display = 'none';
