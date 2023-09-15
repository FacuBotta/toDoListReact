import axios from 'axios';
// handle tasks functions
/* export const updateTask = async (taskData, priority, description, taskName, handleTasks, handleClose) => {
    try {
        const response = await axios.post('http://localhost:3001/api/updateTask', {
            idUser: taskData.id_user,
            idTask: taskData.id_task,
            priority: priority,
            description: description,
            taskName: taskName
        }, {withCredentials: true});
        console.log(response.data)
        handleTasks();
        handleClose();
    } catch (error) {
        console.log(error);
    }
}; */
export const updateTask = (taskData, priority, description, taskName, handleTasks, handleClose) => {
    try {
        axios.post('http://localhost:3001/api/updateTask', {
                idUser: taskData.id_user,
                idTask: taskData.id_task,
                priority: priority,
                description: description,
                taskName: taskName
            }, { withCredentials: true })
            .then(response => {
                console.log(response.data);
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
export const insertNewTask = async (order, status, priority, newDescription, taskName, handleTasks, handleClose, currentGroup, handleGroupTasks) => {
    try {
        const response = await axios.post('http://localhost:3001/api/insertTask', {
            status: status,
            priority: priority,
            newDescription: newDescription,
            taskName: taskName,
            order: order.length + 1,
            group: currentGroup.id_group,
        }, { withCredentials: true })
    } catch (error) {
        console.log(error)
    }
    handleTasks();
    handleClose();
    // handleGroupTasks(currentGroup.id_group);
};
export const updateTasksInDrag = async (newTasks) => {
    try {
        const response = await axios.post('http://localhost:3001/api/updateTaskDrag', {
            withCredentials: true,
            tasks: newTasks,
        });
    } catch (error) {
        console.log(error);
    }
}
export const deleteTask = async (task) => {
    try {
        const response = await axios.post('http://localhost:3001/api/deleteTask',
        { task }, 
        { withCredentials: true });
    } catch (error) {
        console.log (error);
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
// first letter tu uppercase
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}