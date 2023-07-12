import React, { useState } from 'react'
import TaskCard from '../components/TaskCard'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const TasksList = ({ tasksToDo, tasksInProgress, tasksCompleted, handleTasks }) => {
    return (
        <DndProvider backend={HTML5Backend} >
            <div className='container-cards'>
                <TaskCard title='To Do' taskStatus={tasksToDo} handleTasks={handleTasks} />

                <TaskCard title='In Progress' taskStatus={tasksInProgress} handleTasks={handleTasks} />

                <TaskCard title='Completed' taskStatus={tasksCompleted} handleTasks={handleTasks} />
            </div>
        </DndProvider>
    )
}

export default TasksList
