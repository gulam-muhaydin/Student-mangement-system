let students = JSON.parse(localStorage.getItem('students')) || []; // Load students from Local Storage
    let archivedStudents = JSON.parse(localStorage.getItem('archivedStudents')) || []; // Load archived students
    const maxStudents = 40; // Set the limit to 40 students

    // When the page loads, render the counts and hide the data
    document.addEventListener('DOMContentLoaded', () => {
        updateCounts(); // Update counts on load
        renderTable(); // Render table on load
    });

    function addStudent() {
        const name = document.getElementById('studentName').value.trim();
        const rollNumber = document.getElementById('rollNumber').value; // Get roll number
        const age = document.getElementById('age').value;
        const grade = document.getElementById('grade').value;
        const status = document.getElementById('status').value;
        const selectedDate = document.getElementById('attendanceDate').value; // Get selected date

        if (students.length >= maxStudents) {
            document.getElementById('limitMessage').innerText = 'You cannot add more than 40 students.';
            return;
        }

        if (name && rollNumber && age && grade && selectedDate) {
            const student = { name, rollNumber, age, grade, status, date: selectedDate }; // Store student data
            students.push(student);
            saveAttendance(); // Save to local storage
            renderTable(); // Update table
            clearForm();
        } else {
            alert("Please fill in all fields before adding a student.");
        }
    }

    function updateCounts() {
        let presentCount = 0;
        let absentCount = 0;

        // Count all students in local storage
        students.forEach(student => {
            if (student.status === 'Present') {
                presentCount++;
            } else {
                absentCount++;
            }
        });

        document.getElementById('presentCount').innerText = presentCount;
        document.getElementById('absentCount').innerText = absentCount;
    }

    function clearForm() {
        document.getElementById('studentName').value = '';
        document.getElementById('rollNumber').value = ''; // Clear Roll Number field
        document.getElementById('age').value = '';
        document.getElementById('grade').value = '';
        document.getElementById('status').value = 'Present';
        document.getElementById('attendanceDate').value = ''; // Clear date field
    }

    // Save attendance to localStorage
    function saveAttendance() {
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('archivedStudents', JSON.stringify(archivedStudents)); // Save archived data
        alert("Attendance data saved successfully!");
    }

    // Load attendance for the selected date from localStorage and display it in a table format
    function checkAttendance() {
        const selectedDate = document.getElementById('checkDate').value;
        const attendanceBody = document.getElementById('attendanceBody');
        attendanceBody.innerHTML = ''; // Clear the attendance body
        const attendanceTable = document.getElementById('attendanceTable');
        const noDataMessage = document.getElementById('noDataMessage');

        if (!selectedDate) {
            alert("Please select a date.");
            return;
        }

        // Combine active and archived records for searching
        const allRecords = [...students, ...archivedStudents];
        
        // Filter records based on selected date
        const attendanceData = allRecords.filter(student => student.date === selectedDate);
        
        if (attendanceData.length > 0) {
            attendanceData.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.rollNumber}</td>
                    <td>${student.name}</td>
                    <td>${student.status}</td>
                `;
                attendanceBody.appendChild(row);
            });
            attendanceTable.style.display = 'table'; // Show the attendance table
            noDataMessage.style.display = 'none'; // Hide no data message
        } else {
            attendanceTable.style.display = 'none'; // Hide the attendance table
            noDataMessage.style.display = 'block'; // Show no data message
        }
    }

    // Render table with students from localStorage
    function renderTable() {
        const tableBody = document.getElementById('studentTable').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear the table

        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.name}</td>
                <td>${student.rollNumber}</td> <!-- Display Roll Number -->
                <td>${student.age}</td>
                <td>${student.grade}</td>
                <td>
                    <select class="status-select" onchange="updateStatus(${index}, this.value)">
                        <option value="Present" ${student.status === 'Present' ? 'selected' : ''}>Present</option>
                        <option value="Absent" ${student.status === 'Absent' ? 'selected' : ''}>Absent</option>
                    </select>
                </td>
                <td>${student.date}</td>
                <td><button onclick="removeStudent(${index})">Remove</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Update student status when changed
    function updateStatus(index, status) {
        students[index].status = status;
        saveAttendance(); // Save updated attendance to local storage
        updateCounts(); // Update counts
    }

    // Remove student from active list and archive
    function removeStudent(index) {
        const student = students[index];
        archivedStudents.push(student); // Add to archived list
        students.splice(index, 1); // Remove from active list
        renderTable(); // Refresh the active table
        updateCounts(); // Update counts
        saveAttendance(); // Save changes to local storage
    }

    // Clear all data from localStorage
    function clearAllData() {
        if (confirm("Are you sure you want to delete all attendance data? This action cannot be undone.")) {
            localStorage.removeItem('students');
            localStorage.removeItem('archivedStudents');
            students = []; // Reset active students array
            archivedStudents = []; // Reset archived students array
            renderTable(); // Refresh the table
            updateCounts(); // Reset counts
            alert("All attendance data has been deleted.");
        }
    }