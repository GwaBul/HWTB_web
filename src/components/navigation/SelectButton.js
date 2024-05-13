import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import './css/SelectButton.css'

const SelectButton = () => {
    return (
        <div className="select-btn">
                <Box sx={{display:'flex', justifyContent:'center', p:2}}>
                    <Button></Button>
                    <Button></Button>
                    <Button></Button>
                </Box>
        </div>
    );
};

export default SelectButton;