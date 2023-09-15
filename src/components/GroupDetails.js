import React from 'react'
import { handleDates } from '../utils/helpers'
const GroupDetails = ({ group, tasks }) => {
    return (
        <div className='group-details'>
            <span>{group.group_name}</span> created at: {handleDates(group.created_at)}. {tasks[0].name === null ? 'No tasks here!' :
                `${tasks.length} task${tasks.length === 1 ? '' : 's'} here.`}
        </div>
    )
}

export default GroupDetails
