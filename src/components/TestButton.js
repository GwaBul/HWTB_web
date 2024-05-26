import { Button } from '@mui/material';
import React, { useState } from 'react';
import NavigationComponent from './navigation/Navigation';

const TestButton = (map, user) => {
    const [show, setShow] = useState(false);

    const handleClick = () =>{
        setShow(!show);
    }

    return (
        <>
        <Button onClick={handleClick}>
            {show && <NavigationComponent map={map} user={user}/>}
        </Button>
        </>
    );
};

export default TestButton;