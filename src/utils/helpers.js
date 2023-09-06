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
export const insertNewTask = async (order, status, priority, newDescription, taskName, handleTasks, handleClose) => {
    // console.log(order.length + 1, status, priority, newDescription, taskName)
    try {
        const response = await axios.post('http://localhost:3001/api/insertTask', {
            status: status,
            priority: priority,
            newDescription: newDescription,
            taskName: taskName,
            order: order.length + 1,
        }, { withCredentials: true })
    } catch (error) {
        console.log(error)
    }
    handleTasks();
    handleClose();
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
        console.log (error)
    }
}
// first letter tu uppercase
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}