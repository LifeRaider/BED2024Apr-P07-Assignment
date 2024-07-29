function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
}

let currentAnnouncementId = null;

document.addEventListener('DOMContentLoaded', () => {
    const classId = getClassIdFromUrl();
    if (classId) {
        fetchClassDetails(classId);
        fetchAnnouncements(classId);
        fetchAssignments(classId);
        fetchClassUsers(classId);
    } else {
        console.error('No class_id found in the URL');
    }

    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'editClassBtn') {
            showEditClassModal();
        }
        if (event.target && event.target.id === 'deleteClassBtn') {
            showDeleteClassModal();
        }
    });

    document.getElementById('saveClassChanges').addEventListener('click', updateClass);
    document.getElementById('confirmDeleteClass').addEventListener('click', deleteClass);

    // Add event listener for the confirm remove user button
    document.getElementById('confirmRemoveUser').addEventListener('click', confirmRemoveUser);

    // Add event listener for the add user button
    document.getElementById('addUserBtn').addEventListener('click', showAddUserModal);

    // Add event listener for the confirm add user button
    document.getElementById('confirmAddUser').addEventListener('click', confirmAddUser);

    // Add event listener for the add announcement button
    document.getElementById('addAnnouncementBtn').addEventListener('click', showAddAnnouncementModal);

    // Add event listener for the post announcement button
    document.getElementById('postAnnouncementBtn').addEventListener('click', postAnnouncement);

    // Add event listener for the delete class button
    document.getElementById('confirmDeleteAnnouncement').addEventListener('click', deleteAnnouncement);

    // Add event listener for the save announcement changes button
    document.getElementById('saveAnnouncementChanges').addEventListener('click', showConfirmEditAnnouncementModal);

    // Add event listener for the confirm edit announcement button
    document.getElementById('confirmEditAnnouncement').addEventListener('click', editAnnouncement);

    // Add event listener for the add assignment button
    document.getElementById('addAssignmentBtn').addEventListener('click', showAddAssignmentModal);

    // Add event listener for the post assignment button
    document.getElementById('postAssignmentBtn').addEventListener('click', postAssignment);

    // Add event listener for the delete assignment button
    document.getElementById('confirmDeleteAssignment').addEventListener('click', deleteAssignment);

    // Add event listener for the save assignment changes button
    document.getElementById('saveAssignmentChanges').addEventListener('click', showConfirmEditAssignmentModal);

    // Add event listener for the confirm edit assignment button
    document.getElementById('confirmEditAssignment').addEventListener('click', editAssignment);

    // Add event listener for the edit class button
    document.getElementById('editClassBtn').addEventListener('click', showEditClassModal);

    // Add event listener for the save class changes button
    document.getElementById('saveClassChanges').addEventListener('click', updateClass);
});

function showDeleteClassModal() {
    const modal = new bootstrap.Modal(document.getElementById('deleteClassModal'));
    modal.show();
}

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
        const response = await fetch(`http://localhost:3000/assignments/class/${classId}`, {
            headers: {
                'Authorization': getAuthHeader()
            }
        });
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
    const retrievedData = localStorage.getItem('data');
    const userData = JSON.parse(retrievedData);

    const classDetails = document.getElementById('class-details');
    classDetails.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${classData.className} (${classData.classID})</h5>
                <p class="card-text">${classData.classDes}</p>
                <div class="btn-group" role="group" aria-label="Class actions">
                ${userData.userType == "admin" ? `
                    <button id="editClassBtn" class="btn btn-primary">Edit Class</button>
                    <button id="deleteClassBtn" class="btn btn-danger">Delete Class</button>
                ` : ``}
                </div>
            </div>
        </div>
    `;
}

function displayAnnouncements(announcements) {
    const retrievedData = localStorage.getItem('data');
    const userData = JSON.parse(retrievedData);
    
    const announcementsList = document.getElementById('announcements-list');
    if (announcements.length === 0) {
        announcementsList.innerHTML = '<p>No announcements for this class.</p>';
        return;
    }

    announcementsList.innerHTML = announcements.map(announcement => `
        <div class="card mb-3" data-announcement-id="${announcement.announcementID}">
            <div class="card-body">
                <h5 class="card-title">${announcement.announcementTitle}</h5>
                <p class="card-text">${announcement.announcementDes}</p>
                <p class="card-text">
                    <small class="text-muted">
                        Posted on: ${new Date(announcement.announcementDateTime).toLocaleString()}
                    </small>
                </p>
                <p class="card-text">
                    <small class="text-muted">
                        Created by: ${announcement.creatorUsername} (${announcement.announcementCreator})
                    </small>
                </p>
                ${announcement.editedBy ? `
                <p class="card-text">
                    <small class="text-muted">
                        Edited by: ${announcement.editedByUsername} (${announcement.editedBy}) on ${new Date(announcement.editedDateTime).toLocaleString()}
                    </small>
                </p>
                ` : ''}
                ${(userData.userType == "admin" || userData.userType == "teacher") ? `
                    <button class="btn btn-primary btn-sm edit-announcement" data-announcement-id="${announcement.announcementID}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-announcement" data-announcement-id="${announcement.announcementID}">Delete</button>
                ` : ``}
                
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.delete-announcement').forEach(button => {
        button.addEventListener('click', showDeleteAnnouncementConfirmation);
    });

    document.querySelectorAll('.edit-announcement').forEach(button => {
        button.addEventListener('click', showEditAnnouncementModal);
    });
}

function showEditClassModal() {
    const modal = new bootstrap.Modal(document.getElementById('editClassModal'));
    
    // Populate the form with current class details
    const classDetails = document.getElementById('class-details');
    const className = classDetails.querySelector('.card-title').textContent.split('(')[0].trim();
    const classDes = classDetails.querySelector('.card-text').textContent;
    
    document.getElementById('editClassName').value = className;
    document.getElementById('editClassDes').value = classDes;
    
    modal.show();
}

function showEditAnnouncementModal(event) {
    const announcementId = event.target.getAttribute('data-announcement-id');
    currentAnnouncementId = announcementId;
    
    const announcementCard = event.target.closest('.card');
    const title = announcementCard.querySelector('.card-title').textContent;
    const description = announcementCard.querySelector('.card-text').textContent;

    document.getElementById('editAnnouncementTitle').value = title;
    document.getElementById('editAnnouncementDes').value = description;

    const modal = new bootstrap.Modal(document.getElementById('editAnnouncementModal'));
    modal.show();
}

function showConfirmEditAnnouncementModal() {
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editAnnouncementModal'));
    editModal.hide();

    const confirmModal = new bootstrap.Modal(document.getElementById('confirmEditAnnouncementModal'));
    confirmModal.show();
}

async function editAnnouncement() {
    const title = document.getElementById('editAnnouncementTitle').value;
    const description = document.getElementById('editAnnouncementDes').value;
    const classId = getClassIdFromUrl();

    if (!title || !description) {
        alert('Please fill in all fields');
        return;
    }

    const updatedAnnouncementData = {
        announcementID: currentAnnouncementId,
        announcementTitle: title,
        announcementDes: description,
        editedBy: JSON.parse(localStorage.getItem('user')).id,
        editedByUsername: JSON.parse(localStorage.getItem('user')).username
    };

    try {
        const response = await fetch(`http://localhost:3000/announcements/${currentAnnouncementId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()  // Add this line
            },
            body: JSON.stringify(updatedAnnouncementData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Announcement updated successfully:', result);
        
        // Close the modal and refresh the announcements
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmEditAnnouncementModal'));
        modal.hide();
        fetchAnnouncements(classId);

    } catch (error) {
        console.error('Error updating announcement:', error);
        alert('Failed to update announcement. Please try again.');
    }
}

function displayAssignments(assignments) {
    const retrievedData = localStorage.getItem('data');
    const userData = JSON.parse(retrievedData);

    const assignmentsList = document.getElementById('assignments-list');
    if (assignments.length === 0) {
        assignmentsList.innerHTML = '<p>No assignments for this class.</p>';
        return;
    }
    
    assignmentsList.innerHTML = assignments.map(assignment => `
        <div class="card mb-3" data-assignment-id="${assignment.assignmentID}">
            <div class="card-body">
                <h5 class="card-title">${assignment.assignmentTitle}</h5>
                <p class="card-text">${assignment.assignmentDes}</p>
                <p class="card-text"><small class="text-muted">Posted on: ${new Date(assignment.assignmentPostDateTime).toLocaleString()}</small></p>
                <p class="card-text"><small class="text-muted">Due: ${new Date(assignment.assignmentDueDateTime).toLocaleString()}</small></p>
                <p class="card-text"><small class="text-muted">Created by: ${assignment.creatorUsername} (${assignment.assignmentCreator})</small></p>
                ${assignment.editedBy ? `
                <p class="card-text"><small class="text-muted">Last edited by: ${assignment.editedByUsername} (${assignment.editedBy}) on ${new Date(assignment.editedDateTime).toLocaleString()}</small></p>
                ` : ''}
                ${(userData.userType == "admin" || userData.userType == "teacher") ? `
                <button class="btn btn-primary btn-sm edit-assignment" data-assignment-id="${assignment.assignmentID}">Edit</button>
                <button class="btn btn-danger btn-sm delete-assignment" data-assignment-id="${assignment.assignmentID}">Delete</button>
                ` : ``}
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.delete-assignment').forEach(button => {
        button.addEventListener('click', showDeleteAssignmentConfirmation);
    });

    document.querySelectorAll('.edit-assignment').forEach(button => {
        button.addEventListener('click', showEditAssignmentModal);
    });
}

async function updateClass() {
    const classId = getClassIdFromUrl();
    const updatedClassName = document.getElementById('editClassName').value;
    const updatedClassDes = document.getElementById('editClassDes').value;

    const updatedData = {
        className: updatedClassName,
        classDes: updatedClassDes
    };

    try {
        const response = await fetch(`http://localhost:3000/classes/${classId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Class updated successfully:', result);
        
        // Close the modal and refresh the class details
        const modal = bootstrap.Modal.getInstance(document.getElementById('editClassModal'));
        modal.hide();
        fetchClassDetails(classId);
    } catch (error) {
        console.error('Error updating class:', error);
        alert('Failed to update class. Please try again.');
    }
}

async function deleteClass() {
    const classId = getClassIdFromUrl();

    try {
        const response = await fetch(`http://localhost:3000/classes`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify({ classID: classId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        console.log('Class deleted successfully');
        
        // Close the modal and redirect to the main page
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteClassModal'));
        modal.hide();
        window.location.href = 'mainAdmin.html'; // or wherever you want to redirect after deletion
    } catch (error) {
        console.error('Error deleting class:', error);
        alert('Failed to delete class. Please try again.');
    }
}

async function fetchClassUsers(classId) {
    try {
        const response = await fetch(`http://localhost:3000/classes/${classId}/ClassUsers`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const users = await response.json();
        displayClassUsers(users);
    } catch (error) {
        console.error('Error fetching class users:', error);
    }
}

function displayClassUsers(users) {
    const retrievedData = localStorage.getItem('data');
    const userData = JSON.parse(retrievedData);

    const classUsersList = document.getElementById('class-users-list');
    if (!users || users.length === 0) {
        classUsersList.innerHTML = '<p>No users in this class.</p>';
        return;
    }

    // Sort users: teachers first, then students
    const sortedUsers = users.sort((a, b) => {
        const roleOrder = { T: 0, S: 1, P: 2 };
        return roleOrder[a.userID[0]] - roleOrder[b.userID[0]];
    });

    // Filter out parents
    const filteredUsers = sortedUsers.filter(user => user.userID[0] !== 'P');

    const userHTML = filteredUsers.map(user => `
        <div class="card mb-2">
            <div class="card-body">
                <h5 class="card-title">${user.username} (${user.userID})</h5>
                <p class="card-text">Role: ${user.userID[0] === 'T' ? 'Teacher' : 'Student'}</p>
                <p class="card-text">Email: ${user.email}</p>
                    ${(userData.userType == "admin" || userData.userType == "teacher") ? `
                    <button class="btn btn-danger btn-sm remove-user" data-userid="${user.userID}" data-username="${user.username}">Remove User</button>
                ` : ``}
                
            </div>
        </div>
    `).join('');

    classUsersList.innerHTML = userHTML;

    // Add event listeners to the remove buttons
    document.querySelectorAll('.remove-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-userid');
            const username = this.getAttribute('data-username');
            showRemoveUserModal(userId, username);
        });
    });
}

function showRemoveUserModal(userId, username) {
    const modal = new bootstrap.Modal(document.getElementById('removeUserModal'));
    const modalBody = document.getElementById('removeUserModal').querySelector('.modal-body');
    modalBody.textContent = `Are you sure you want to remove ${username} (${userId}) from the class? This action cannot be undone.`;
    
    document.getElementById('confirmRemoveUser').setAttribute('data-userid', userId);
    modal.show();
}

function confirmRemoveUser() {
    const userId = this.getAttribute('data-userid');
    removeUserFromClass(userId);
    const modal = bootstrap.Modal.getInstance(document.getElementById('removeUserModal'));
    modal.hide();
}

async function removeUserFromClass(userId) {
    const classId = getClassIdFromUrl();
    try {
        const response = await fetch(`http://localhost:3000/classes/${classId}/remove`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: userId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const updatedUsers = await response.json();
        displayClassUsers(updatedUsers);
    } catch (error) {
        console.error('Error removing user from class:', error);
        alert('Failed to remove user from class. Please try again.');
    }
}

async function showAddUserModal() {
    const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));
    const userList = document.getElementById('userList');
    userList.innerHTML = 'Loading users...';
    
    try {
        const classId = getClassIdFromUrl();
        const [allUsers, classUsers] = await Promise.all([
            fetch('http://localhost:3000/users').then(res => res.json()),
            fetch(`http://localhost:3000/classes/${classId}/ClassUsers`)
                .then(res => res.json())
                .catch(err => {
                    console.warn('Failed to fetch class users, assuming empty class:', err);
                    return []; // Return an empty array if fetching class users fails
                })
        ]);

        const filteredUsers = filterAndSortUsers(allUsers, classUsers);
        displayUsersToAdd(filteredUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        userList.innerHTML = 'Error loading users. Please try again.';
    }
    
    addUserModal.show();
}

function filterAndSortUsers(allUsers, classUsers) {
    // Create a Set of existing class user IDs for faster lookup
    const existingUserIds = new Set(classUsers.map(user => user.userID));

    // Filter users
    const filteredUsers = allUsers.filter(user => {
        const userId = user.userID || user.userId || user.id || '';
        return userId &&
               !existingUserIds.has(userId) &&
               !userId.startsWith('A') &&
               !userId.startsWith('P');
    });

    // Sort users: teachers first, then students
    return filteredUsers.sort((a, b) => {
        const roleA = (a.userID || a.userId || a.id || '')[0];
        const roleB = (b.userID || b.userId || b.id || '')[0];
        if (roleA === 'T' && roleB !== 'T') return -1;
        if (roleA !== 'T' && roleB === 'T') return 1;
        return 0;
    });
}

function displayUsersToAdd(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    if (!Array.isArray(users) || users.length === 0) {
        userList.innerHTML = 'No users available to add.';
        return;
    }

    users.forEach(user => {
        if (!user || typeof user !== 'object') {
            console.error('Invalid user data:', user);
            return;
        }

        const userId = user.userID || user.userId || user.id || 'Unknown';
        const username = user.username || 'Unknown';
        const email = user.email || 'No email';

        const userDiv = document.createElement('div');
        userDiv.className = 'col-md-6 mb-3';
        userDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${username} (${userId})</h5>
                    <p class="card-text">Email: ${email}</p>
                    <p class="card-text">Role: ${getUserRole(userId)}</p>
                    <button class="btn btn-primary btn-sm add-user" data-userid="${userId}" data-username="${username}">Add User</button>
                </div>
            </div>
        `;
        userList.appendChild(userDiv);
    });

    // Add event listeners to the add buttons
    document.querySelectorAll('.add-user').forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-userid');
            const username = this.getAttribute('data-username');
            showConfirmAddUserModal(userId, username);
        });
    });
}

function getUserRole(userId) {
    if (typeof userId !== 'string' || userId.length === 0) {
        return 'Unknown';
    }
    const firstChar = userId.charAt(0).toUpperCase();
    switch (firstChar) {
        case 'T': return 'Teacher';
        case 'S': return 'Student';
        default: return 'Unknown';
    }
}

function showConfirmAddUserModal(userId, username) {
    const modal = new bootstrap.Modal(document.getElementById('confirmAddUserModal'));
    const modalBody = document.getElementById('confirmAddUserModal').querySelector('.modal-body');
    modalBody.textContent = `Are you sure you want to add ${username} (${userId}) to the class?`;
    
    document.getElementById('confirmAddUser').setAttribute('data-userid', userId);
    modal.show();
}

async function confirmAddUser() {
    const userId = this.getAttribute('data-userid');
    const classId = getClassIdFromUrl();
    
    try {
        const response = await fetch(`http://localhost:3000/classes/${classId}/add`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: userId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const updatedUsers = await response.json();
        displayClassUsers(updatedUsers);

        // Close both modals
        bootstrap.Modal.getInstance(document.getElementById('confirmAddUserModal')).hide();
        bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();

        // Show success message
        alert('User added successfully!');
    } catch (error) {
        console.error('Error adding user to class:', error);
        alert('Failed to add user to class. Please try again.');
    }
}

function showAddAnnouncementModal() {
    const addAnnouncementModal = new bootstrap.Modal(document.getElementById('addAnnouncementModal'));
    addAnnouncementModal.show();
}

async function postAnnouncement() {
    const classId = getClassIdFromUrl();
    const title = document.getElementById('announcementTitle').value;
    const description = document.getElementById('announcementDes').value;

    if (!title || !description) {
        alert('Please fill in all fields');
        return;
    }

    const newAnnouncementData = {
        announcementTitle: title,
        announcementDes: description,
        announcementClass: classId
    };

    try {
        const response = await fetch('http://localhost:3000/announcements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify(newAnnouncementData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Announcement posted successfully:', result);
        
        // Close the modal and refresh the announcements
        const modal = bootstrap.Modal.getInstance(document.getElementById('addAnnouncementModal'));
        modal.hide();
        fetchAnnouncements(classId);

        // Clear the form
        document.getElementById('addAnnouncementForm').reset();
    } catch (error) {
        console.error('Error posting announcement:', error);
        alert('Failed to post announcement. Please try again.');
    }
}

function showDeleteAnnouncementConfirmation(event) {
    const announcementId = event.target.getAttribute('data-announcement-id');
    currentAnnouncementId = announcementId;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteAnnouncementModal'));
    modal.show();
}

async function deleteAnnouncement() {
    try {
        const response = await fetch(`http://localhost:3000/announcements`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()  // Add this line
            },
            body: JSON.stringify({ announcementID: currentAnnouncementId }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete announcement');
        }

        removeAnnouncementFromUI(currentAnnouncementId);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAnnouncementModal'));
        modal.hide();
    } catch (error) {
        console.error('Error deleting announcement:', error);
        alert('Failed to delete announcement. Please try again.');
    }
}

function removeAnnouncementFromUI(announcementId) {
    const announcementCard = document.querySelector(`[data-announcement-id="${announcementId}"]`);
    if (announcementCard) {
        announcementCard.remove();
    }
}

function showAddAssignmentModal() {
    const addAssignmentModal = new bootstrap.Modal(document.getElementById('addAssignmentModal'));
    addAssignmentModal.show();
}

function validateDateTime(date, time) {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const dueDateTime = new Date(date);
    dueDateTime.setHours(hours, minutes);

    return dueDateTime > now;
}

async function postAssignment() {
    const classId = getClassIdFromUrl();
    const title = document.getElementById('assignmentTitle').value;
    const description = document.getElementById('assignmentDes').value;
    const dueDate = document.getElementById('assignmentDueDate').value;
    const dueTime = document.getElementById('assignmentDueTime').value;

    if (!title || !description || !dueDate || !dueTime) {
        alert('Please fill in all fields');
        return;
    }

    if (!validateDateTime(dueDate, dueTime)) {
        alert('Due date and time must be in the future');
        return;
    }

    const dueDateTime = new Date(`${dueDate}T${dueTime}`).toISOString();

    const newAssignmentData = {
        assignmentTitle: title,
        assignmentDes: description,
        assignmentDueDateTime: dueDateTime,
        assignmentClass: classId
    };

    try {
        const response = await fetch('http://localhost:3000/assignments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify(newAssignmentData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Assignment posted successfully:', result);
        
        // Close the modal and refresh the assignments
        const modal = bootstrap.Modal.getInstance(document.getElementById('addAssignmentModal'));
        modal.hide();
        fetchAssignments(classId);

        // Clear the form
        document.getElementById('addAssignmentForm').reset();
    } catch (error) {
        console.error('Error posting assignment:', error);
        alert('Failed to post assignment. Please try again.');
    }
}

function showDeleteAssignmentConfirmation(event) {
    const assignmentId = event.target.getAttribute('data-assignment-id');
    currentAssignmentId = assignmentId;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteAssignmentModal'));
    modal.show();
}

async function deleteAssignment() {
    try {
        const response = await fetch(`http://localhost:3000/assignments`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()  // Add this line
            },
            body: JSON.stringify({ assignmentID: currentAssignmentId }),
        });

        if (!response.ok) {
            throw new Error('Failed to delete assignment');
        }

        removeAssignmentFromUI(currentAssignmentId);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAssignmentModal'));
        modal.hide();
    } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Failed to delete assignment. Please try again.');
    }
}

function removeAssignmentFromUI(assignmentId) {
    const assignmentCard = document.querySelector(`[data-assignment-id="${assignmentId}"]`);
    if (assignmentCard) {
        assignmentCard.remove();
    }
}

function showEditAssignmentModal(event) {
    const assignmentId = event.target.getAttribute('data-assignment-id');
    currentAssignmentId = assignmentId;
    
    const assignmentCard = event.target.closest('.card');
    const title = assignmentCard.querySelector('.card-title').textContent;
    const description = assignmentCard.querySelector('.card-text').textContent;
    const dueDateTime = new Date(assignmentCard.querySelector('.text-muted').textContent.replace('Due: ', ''));

    document.getElementById('editAssignmentTitle').value = title;
    document.getElementById('editAssignmentDes').value = description;
    document.getElementById('editAssignmentDueDate').value = dueDateTime.toISOString().split('T')[0];
    document.getElementById('editAssignmentDueTime').value = dueDateTime.toTimeString().split(' ')[0].substr(0, 5);

    const modal = new bootstrap.Modal(document.getElementById('editAssignmentModal'));
    modal.show();
}

function showConfirmEditAssignmentModal() {
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editAssignmentModal'));
    editModal.hide();

    const confirmModal = new bootstrap.Modal(document.getElementById('confirmEditAssignmentModal'));
    confirmModal.show();
}

async function editAssignment() {
    const title = document.getElementById('editAssignmentTitle').value;
    const description = document.getElementById('editAssignmentDes').value;
    const dueDate = document.getElementById('editAssignmentDueDate').value;
    const dueTime = document.getElementById('editAssignmentDueTime').value;
    const classId = getClassIdFromUrl();

    if (!title || !description || !dueDate || !dueTime) {
        alert('Please fill in all fields');
        return;
    }

    if (!validateDateTime(dueDate, dueTime)) {
        alert('Due date and time must be in the future');
        return;
    }

    const dueDateTime = new Date(`${dueDate}T${dueTime}`).toISOString();

    const updatedAssignmentData = {
        assignmentID: currentAssignmentId,
        assignmentTitle: title,
        assignmentDes: description,
        assignmentDueDateTime: dueDateTime,
        editedBy: JSON.parse(localStorage.getItem('user')).id
    };

    try {
        const response = await fetch(`http://localhost:3000/assignments/${currentAssignmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAuthHeader()
            },
            body: JSON.stringify(updatedAssignmentData),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const result = await response.json();
        console.log('Assignment updated successfully:', result);
        
        // Close the modal and refresh the assignments
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmEditAssignmentModal'));
        modal.hide();
        fetchAssignments(classId);

    } catch (error) {
        console.error('Error updating assignment:', error);
        alert('Failed to update assignment. Please try again.');
    }
}