import React from 'react'
import '../styles/App.css'
import homePageImage from '../assets/homePageImage.png'
function HomePage() {
    return (
        <>
            <div className='container-home'>
                <div className='home-title'>
                    <h1>Hello There!</h1>
                </div>
                <div className='home-bottom-block'>
                    <div className='home-image' style={{
                        backgroundImage: `url(${homePageImage})`,
                    }}>
                    </div>
                    <div className='home-description'>
                        <p>This is a non-profit project I developed using React and Node.js to enhance my programming skills, and I'm thrilled to share it with you. I want to emphasize that the website utilizes cookies to maintain user sessions, and by accessing the site, you agree to this single condition. Enjoy the application and best of luck with managing your tasks!</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage;