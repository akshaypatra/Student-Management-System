import React from 'react'
import UserList from './AdminDashboardComponents/UserList'
import SubjectList from './AdminDashboardComponents/SubjectList'
import ClassroomList from './AdminDashboardComponents/ClassroomList'


export default function AdminDashboard() {
  return (
    <section className='admin-container'>
      <header className='admin-header'>
          <h1>Admin Dashboard</h1>
      </header>
      
      <div className='admin-subcontainer'>

        <div className='admin-users-container'>
          <h2>Users</h2>
          <UserList/>
        </div>

        <div className='admin-subject-container'>
          <h2>Subjects</h2>
          <SubjectList/>
        </div>

        <div className='admin-classroom-container'>
          <h2>Classrooms</h2>
          <ClassroomList/>
        </div>
        

      </div>

      
    </section>
  )
}
