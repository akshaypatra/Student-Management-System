import React from 'react'
import ClassList from './TeacherDashboardComponents/ClassList'
import QueriesList from './TeacherDashboardComponents/QueriesList'
// import ClassDetails from './TeacherDashboardComponents/ClassDetails'

export default function TeacherDashboard() {
  return (
    <div className='teacher-dashboard-container'>
      <h1>Teacher Dashboard</h1>
      <section>
        {/* <ClassDetails/> */}
        <ClassList/>
        
      </section>
      <section className='t-queries-section'>
         <QueriesList/>
      </section>


    </div>
  )
}
