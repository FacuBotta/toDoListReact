import React from 'react'
import { handleDates } from '../utils/helpers'
const GroupDetails = ({ group }) => {
    return (
        <div className='group-details'>
            <span>{group.name}</span> created at: { handleDates(group.created_at) }.
        </div>
    )
}

export default GroupDetails
