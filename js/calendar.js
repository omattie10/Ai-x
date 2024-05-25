document.addEventListener('DOMContentLoaded', () => {
    const calendarDiv = document.getElementById('calendar');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const timeDisplay = document.getElementById('time-display');
    const currentViewDate = document.getElementById('current-view-date');
    const reminderDateInput = document.getElementById('reminder-date');
    const reminderTextInput = document.getElementById('reminder-text');
    const addReminderBtn = document.getElementById('add-reminder');

    let currentDate = new Date();
    const today = new Date();

    const reminders = JSON.parse(localStorage.getItem('reminders')) || [];

    const renderCalendar = (date) => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        currentViewDate.textContent = `${monthNames[month]} ${year}`;

        const calendarHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateCalendarRows(firstDay, lastDay, month, year)}
                </tbody>
            </table>
        `;

        calendarDiv.innerHTML = calendarHTML;
        updateTime();
    };

    const generateCalendarRows = (firstDay, lastDay, month, year) => {
        let rows = '';
        let day = 1;

        for (let i = 0; i < 6; i++) {
            let cells = '';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    cells += '<td></td>';
                } else if (day > lastDay) {
                    cells += '<td></td>';
                } else {
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                    const reminder = reminders.find(r => new Date(r.date).toDateString() === new Date(year, month, day).toDateString());
                    cells += `<td class="${isToday ? 'today' : ''}">${day}${reminder ? `<div class="reminder">${reminder.text}</div>` : ''}</td>`;
                    day++;
                }
            }
            rows += `<tr>${cells}</tr>`;
        }

        return rows;
    };

    const updateTime = () => {
        const timezone = getCookie('timezone') || 'Europe/London';
        const now = new Date();
        const timeInZone = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        timeDisplay.textContent = timeInZone.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    addReminderBtn.addEventListener('click', () => {
        const date = reminderDateInput.value;
        const text = reminderTextInput.value.trim();
        if (date && text) {
            reminders.push({ date, text });
            localStorage.setItem('reminders', JSON.stringify(reminders));
            reminderDateInput.value = '';
            reminderTextInput.value = '';
            renderCalendar(currentDate);
        }
    });

    setInterval(updateTime, 60000); // Update time every minute
    renderCalendar(currentDate);
});
