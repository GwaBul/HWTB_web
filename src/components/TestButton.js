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
            
        </Button>
        </>
    );
};

export default TestButton;