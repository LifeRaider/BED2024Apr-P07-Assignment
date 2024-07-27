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

    // Add event listener for the confirm remove user button
    document.getElementById('confirmRemoveUser').addEventListener('click', confirmRemoveUser);

    // Add event listener for the add user button
    document.getElementById('addUserBtn').addEventListener('click', showAddUserModal);

    // Add event listener for the confirm add user button
    document.getElementById('confirmAddUser').addEventListener('click', confirmAddUser);
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
        populateEditForm(classData);
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
                <h5 class="card-title">${classData.className} (${classData.classID})</h5>
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

function populateEditForm(classData) {
    document.getElementById('editClassName').value = classData.className;
    document.getElementById('editClassDes').value = classData.classDes;
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
        window.location.href = 'landing-page.html';
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
                <button class="btn btn-danger btn-sm remove-user" data-userid="${user.userID}" data-username="${user.username}">Remove User</button>
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