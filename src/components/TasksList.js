import React, { useState } from 'react'
import TaskCard from '../components/TaskCard'

const TasksList = ({ tasksToDo, tasksInProgress, tasksCompleted }) => {
    console.log(tasksToDo.length)
    console.log(tasksInProgress)
    console.log(tasksCompleted)
    return (
        <div className='container-cards'>
            <TaskCard title='To Do' taskStatus={tasksToDo} />

            <TaskCard title='In Progres' taskStatus={tasksInProgress} />

            <TaskCard title='Completed' taskStatus={tasksCompleted} />
        </div>
    )
}

export default TasksList
