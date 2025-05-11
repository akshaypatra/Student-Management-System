import React from 'react'
import EnrolledClasses from './StudentDashboardComponents/EnrolledClasses'
import Queries from './StudentDashboardComponents/Queries'

export default function StudentDashboard() {
  return (
    <div>
      <h1>Student Dashboard</h1>
      <section className='enrolled-classes'>
          <EnrolledClasses/>
      </section>
      <section>
          <Queries/>
      </section>
      
    
    
    </div>
  )
}
