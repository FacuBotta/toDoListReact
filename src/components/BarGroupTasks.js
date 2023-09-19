import { React, useEffect, useState, useRef } from 'react'
import { insertNewGroupTask, capitalizeFirstLetter } from '../utils/helpers'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Draggable } from 'react-beautiful-dnd';

const BarGroupTasks = ({ groups, currentGroup, handleTasks, provided }) => {
    // console.log(groups[currentGroup].id)
    const [activeGroupIndex, setActiveGroupIndex] = useState(currentGroup);
    const [groupName, setGroupName] = useState('');
    const [isCarrousel, setIsCarousel] = useState(false);
    const sliderRef = useRef(null);
    const slideRef = useRef(null);
    useEffect(() => {
        const updateIsCarousel = () => {
            if (slideRef.current && sliderRef.current) {
                const totalWidth = slideRef.current.scrollWidth;
                const visibleWidth = sliderRef.current.clientWidth;
                setIsCarousel(totalWidth > visibleWidth);
            }
        };
        updateIsCarousel();

        window.addEventListener('resize', updateIsCarousel);

        return () => {
            window.removeEventListener('resize', updateIsCarousel);
        };
    }, [groups]);

    const handleScroll = (e, dir) => {
        e.preventDefault()
        if (dir == 'left') {
            slideRef.current.scrollLeft -= 100;
        } else if (dir == 'right') {
            slideRef.current.scrollLeft += 100;
        }
    }

    const handleInsertGroup = (e) => {
        e.preventDefault();
        insertNewGroupTask(groupName, handleTasks);
        setGroupName('');
    }

    return (
        <div
            className="bar-group-tasks"
            ref={provided.innerRef}
            {...provided.droppableProps}
        >
            {/* slider of groupsTasks */}
            <div ref={sliderRef} className='container-slider-groups'>
                {isCarrousel && (
                    <div onClick={(e) => handleScroll(e, 'left')} className='group-slide-btn left'>
                        <ArrowLeftIcon />
                    </div>
                )}
                <div ref={slideRef} className='group-slide'>
                    {groups.length === 0 ? (
                        <p>No groups to show</p>
                    ) : (
                        groups.map((group, index) => (
                            <Draggable
                                draggableId={`${group.id}`}
                                key={index}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            border: snapshot.isDragging ? ' 1px solid #0dff92' : 'none',
                                            ...provided.draggableProps.style
                                        }}
                                        onClick={() => {
                                            localStorage.setItem('currentGroupStorage', index);
                                            setActiveGroupIndex(index);
                                            handleTasks()
                                        }}
                                        className={activeGroupIndex === index ? 'group-tasks-item isActive' : 'group-tasks-item'}
                                    >
                                        <p id={group.id}>{group.name}</p>
                                    </div>
                                )}
                            </Draggable>
                        ))
                    )}
                </div>
                {isCarrousel && (
                    <div onClick={(e) => handleScroll(e, 'right')} className='group-slide-btn rigth'>
                        <ArrowRightIcon />
                    </div>
                )}
            </div>
            <div className='container-group-maker'>
                <input
                    value={groupName}
                    placeholder="New Group name"
                    onChange={(e) => setGroupName(capitalizeFirstLetter(e.target.value))}
                />
                <button
                    onClick={(e) =>
                        groupName !== ''
                            ? handleInsertGroup(e)
                            : window.alert("Group name can't be null")
                    }
                >
                    Create Group
                </button>
            </div>
            {provided.placeholder}
        </div>
    );
};



export default BarGroupTasks
