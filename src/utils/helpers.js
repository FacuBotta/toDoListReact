import axios from 'axios';

// handle tasks functions
export const updateTask = (taskData, priority, description, taskName, handleTasks, handleClose, groupId) => {
    try {
        axios.post('http://localhost:3001/api/updateTask', {
            idUser: taskData.id_user,
            idTask: taskData.id_task,
            priority: priority,
            description: description,
            taskName: taskName,
            groupId: groupId,
        }, { withCredentials: true })
            .then(response => {
                handleTasks();
                handleClose();
            })
            .catch(error => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
};
export const insertNewTask = async (order, status, priority, newDescription, taskName, handleTasks, handleClose, groupId) => {
    try {
        const response = await axios.post('http://localhost:3001/api/insertTask', {
            status: status,
            priority: priority,
            newDescription: newDescription,
            taskName: taskName,
            order: order.length + 1,
            groupId: groupId,
        }, { withCredentials: true })
        // console.log('tasks inserted', response)
        handleTasks();
    } catch (error) {
        console.log(error)
    }
    handleClose();
};
export const updateTasksInDrag = async (newTasks, currentGroup, handleTasks) => {
    try {
        const response = await axios.post('http://localhost:3001/api/updateTaskDrag', {
            withCredentials: true,
            tasks: newTasks,
            groupId: currentGroup
        });
        // console.log(response)
        handleTasks();
    } catch (error) {
        console.log(error);
    }
}
export const deleteTask = async (task, groupId, handleTasks) => {
    try {
        const response = await axios.post('http://localhost:3001/api/deleteTask',
            { task, groupId },
            { withCredentials: true });
        // console.log(response)
        handleTasks();
    } catch (error) {
        console.log(error);
    }
}
export const insertNewGroupTask = async (groupName, handleTasks) => {
    try {
        const response = await axios.post('http://localhost:3001/api/insertGroup',
            { groupName: groupName },
            { withCredentials: true });
        console.log(response)
        handleTasks();
    } catch (error) {
        console.log(error);
    }
}

export const deleteGroupTask = async (groupId, handleTasks) => {
    try {
        const response = await axios.post('http://localhost:3001/api/deleteGroupTasks',
            { groupId: groupId },
            { withCredentials: true });
        // console.log(response.data)
        handleTasks()
    } catch (error) {
        console.log('error deleting group of tasks:', error)
    }
}
//format dates
export const handleDates = (date) => {
    const dateObject = new Date(date);
    const optionsDate = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const formattedDate = dateObject.toLocaleDateString('en-US', optionsDate);
    const formattedTime = dateObject.toLocaleTimeString('en-US', optionsTime);
    const finalFormattedDate = `${formattedDate} at ${formattedTime}hrs`;
    return finalFormattedDate;
}
// first letter to uppercase
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}