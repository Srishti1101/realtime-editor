import React from 'react'
import Avatar from 'react-avatar'

const Client = ({userName}) => {
    return (
        <div className='client'>
            <Avatar name={userName} size={40} round="10px"/>
            <span className='username'>{userName}</span>
        </div>
    )
}

export default Client
