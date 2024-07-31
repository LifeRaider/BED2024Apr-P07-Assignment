# 🧠 The Brain Jam System 🧠
**🚧 Currently in development 🚧**

Welcome to **Brain Jam**, the innovative tuition center management system designed to enhance learning experiences for students, teachers, and parents. We're excited to have you here and hope you find our platform intuitive and helpful. With Brain Jam, you can manage classes, track assignments, view progress, and communicate effectively. Let's empower minds and create connections, one lesson at a time! 📚

## Design Process

Hello there! Welcome to Brain Jam, the ultimate tuition center management system where learning becomes an engaging journey. We are Marvin ([@s10260527](https://github.com/s10260527)), Jovan ([@s10257399](https://github.com/LifeRaider)), and Lucas ([@s10257164](https://github.com/LoocasToh)), a team of aspiring developers passionate about education and technology. We created this system to streamline the tuition center experience and foster better connections between students, teachers, and parents. Are you ready to revolutionize learning? 🚀

Our website is designed for ease of use and efficient navigation. Once logged in, users will see a dashboard of their classes. Each role (student, teacher, parent, admin) has access to specific features designed to enhance their experience with the tuition center.

Students can view their classes, assignments, and announcements. How much can you improve your grades? 📈

Teachers can manage their classes, create assignments, and create announcements. They can also receive feedback from parents effectively. Ready to inspire the next generation? 🍎

Parents can monitor their child's progress, view announcements, their assignments, and give feedback to teachers. Stay involved in your child's education journey! 👨‍👩‍👧‍👦

Admins have full control over the system, managing users, classes, and overall operations of the tuition center. Streamline your tuition center management today! 🏫

You can access all these features by navigating through the system with ease. Will you help us create the future of education? 💡

For the curious minds out there itching to get a sneak peak at the initial wireframes of the webite, you can find the Word Document (.docx) here: [Initial Website Wireframe](/BED%20Checkpoint%201%20Wireframes.docx)

## Features

As our system is still under development, you might encounter some features that are not fully implemented. Rest assured, we're working diligently to bring you a complete and robust platform! 🛠️
>Last updated on 30/07/2024
### Existing Features
- Register Account (Student, Parent)
- Login Account
- Logout Account
- View Account Details
- Edit / Delete Account
- View Classes (Admin, *Student)
- Create / Delete Class (Admin)
- Get Class Information (Admin)
- Edit Class Details (Admin)
- Create / Edit / Delete Announcements (Admin)
- Create / Edit / Delete Assignments (Admin)
- Add / Remove Class Users (Admin)

### Features to Implement
- Limit Access to Functions for Users (Student, Parent, Teacher)
- Link Parent to Student Account
- Page for Creating Teacher Accounts (Admin)
- Student Progress Tracking
- Parent-Teacher Feedback
- And Much More...

### Possible Future Features
- Mobile Application for on-the-go access
- Integration with popular 3rd party learning management systems
- Virtual classroom for online tutoring sessions

## Materials Used

Here are the materials used in the development of the Brain Jam system:

1. Languages
    - Hyper Text Markup Language (HTML)
    - Cascading Style Sheets (CSS)
    - JavaScript (JS)
2. Frameworks
    - Node.js
    - Express.js
3. Database
    - Microsoft SQL Server
4. AI Chatbots / Coding Assistants
    - OpenAI's ChatGPT-4o
    - Anthropic's Claude 3.5 Sonnet
    - Microsoft's GitHub Copilot
    - Gignite

> [!NOTE]
> We used various development tools and resources to assist in our coding process, always striving to deliver the best possible product.

## Credits

### Pages, Scripts and Functions
By ***Marvin -*** [***@s10260527***](https://github.com/s10260527)
- getAllAnnouncements, getAnnouncementsByClassId, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement
- getAllAssignments, getAssignmentsByClassId, getAssignmentById, createAssignment, updateAssignment, deleteAssignment
- getAllClasses, getClassById, updateClass, deleteClass
- class.js (HTML Script)
- In script.js; showModal, hideModal, populateTeacherDropdown, sortSelectOptions, handleSubjectSelection, handleTeacherSelection, createClass, fetchClasses, fetchUsers, showRemoveUserModal, confirmRemoveUser, removeUserFromClass
- classAdmin.html, mainAdmin.html
- SQL Trigger for UTC Time & Update Existing Data to UTC
- Gignite for Create Class Modal & Admin Viewing Class Page

By ***Jovan -*** [***@s10257399***](https://github.com/LifeRaider)
- authorization.js
- getAllUsers, register, login, deleteUser, editUser
- getAllUserClass
- createFeedback, getFeedbacksByClassID
- classParent.html, classStudent.html, classTeacher.html, index.html, login.html, mainOthers.html, profile.html, signup.html
- styles.css, styles2.css
- In script.js; loading, loaded, sign up page check, signup, login, editing, editUser, deleting, cancel, deleteUser, logout, back, authentification check
- Gignite for User Profile Page

By ***Lucas -*** [***@s10257164***](https://github.com/LoocasToh)
- addToClass, getClassUsers, createClass, removeFromClass
- Swagger API Docs
- SQL Create Tables & Test Data
- Gignite for Footer (In first submission)

### Others
- Database Design (By ***Marvin -*** [***@s10260527***](https://github.com/s10260527), ***Jovan -*** [***@s10257399***](https://github.com/LifeRaider), ***Lucas -*** [***@s10257164***](https://github.com/LoocasToh))
- README Write-up (By ***Marvin -*** [***@s10260527***](https://github.com/s10260527))

## References

### Inspiration
- Blackboard Learn
- Google Classroom
- Edmodo

### Resources
- Icons ([***IconFinder***](https://www.iconfinder.com/))
- CSS Framework (Bootstrap)
- JavaScript Library (jQuery)
- Gignite ([***Gignite***](https://www.gignite.ai/))
