import React, { useState } from 'react'
// import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
// import FormInsertTask from './FormInsertTask';

const TasksFilter = ({ user, tasks, handleTasks }) => {
    // console.log(user);
    const [visibility, setVisibility] = useState(false);

    return (
        <>
            <div className='container-user'>
                <h2>Welcome back {user.name}</h2>
                <div className='container-search-user'>
                    <input placeholder='Search a task'></input>
                    <select>
                        <option value=''>-- Filter --</option>
                        <option value='toDo'>To Do</option>
                        <option value='doing'>Doing</option>
                        <option value='did'>Did</option>
                    </select>
                    {/* <button onClick={() => setVisibility(!visibility)}>
                        <PlaylistAddIcon />
                    </button> */}
                    {/* <FormInsertTask visibility={visibility} handleTasks={handleTasks} tasks={tasks} user={user.id_user}/> */}
                </div>
            </div>
        </>
    )
}

export default TasksFilter
