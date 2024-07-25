document.addEventListener('DOMContentLoaded', () => {
    const classId = getClassIdFromUrl();
    if (classId) {
        fetchClassDetails(classId);
        fetchAnnouncements(classId);
        fetchAssignments(classId);
    } else {
        console.error('No class_id found in the URL');
    }
});

function getClassIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('class_id');
}

async function fetchClassDetails(classId) {
    try {
        const response = await fetch(`http://localhost:3000/classes/${classId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const classData = await response.json();
        displayClassDetails(classData);
    } catch (error) {
        console.error('Error fetching class details:', error);
    }
}

async function fetchAnnouncements(classId) {
    try {
        const response = await fetch(`http://localhost:3000/announcements/class/${classId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const announcements = await response.json();
        displayAnnouncements(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
    }
}

async function fetchAssignments(classId) {
    try {
        const response = await fetch(`http://localhost:3000/assignments/class/${classId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const assignments = await response.json();
        displayAssignments(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
    }
}

function displayClassDetails(classData) {
    const classDetails = document.getElementById('class-details');
    classDetails.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${classData.className}</h5>
                <p class="card-text">${classData.classDes}</p>
            </div>
        </div>
    `;
}

function displayAnnouncements(announcements) {
    const announcementsList = document.getElementById('announcements-list');
    if (announcements.length === 0) {
        announcementsList.innerHTML = '<p>No announcements for this class.</p>';
        return;
    }
    
    announcementsList.innerHTML = announcements.map(announcement => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${announcement.announcementTitle}</h5>
                <p class="card-text">${announcement.announcementDes}</p>
                <p class="card-text"><small class="text-muted">Posted on: ${new Date(announcement.announcementDateTime).toLocaleString()}</small></p>
            </div>
        </div>
    `).join('');
}

function displayAssignments(assignments) {
    const assignmentsList = document.getElementById('assignments-list');
    if (assignments.length === 0) {
        assignmentsList.innerHTML = '<p>No assignments for this class.</p>';
        return;
    }
    
    assignmentsList.innerHTML = assignments.map(assignment => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${assignment.assignmentTitle}</h5>
                <p class="card-text">${assignment.assignmentDes}</p>
                <p class="card-text"><small class="text-muted">Due: ${new Date(assignment.assignmentDueDateTime).toLocaleString()}</small></p>
            </div>
        </div>
    `).join('');
}