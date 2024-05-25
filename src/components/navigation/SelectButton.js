import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import './css/SelectButton.css';

const SelectButton = () => {
    const [selectedButton, setSelectedButton] = useState("button1");

    const renderComponent = () => {
        switch(selectedButton) {
            case 'button1':
                return  '경로1';
            case 'button2':
                return '경로2';
            case 'button3':
                return '경로3';
            default:
                return <Typography>버튼을 선택하세요.</Typography>;
        }
    };

    return (
        <div className="select-btn">
            <Box sx={{display:'flex', flexDirection:'column' ,justifyContent:'center', alignItems:'end', py:1, height:'200px'}}>
                <Button 
                    variant='contained'
                    sx={{
                        backgroundColor:'#C2C2C2', 
                        border:'none', 
                        my:0.5, 
                        width:'90px',
                        fontFamily:'NanumBarunGothicBold',
                        fontSize:'18px',
                        height:'40px',
                        borderTopLeftRadius: '10px', 
                        borderBottomLeftRadius: '10px', 
                        '&:hover': {
                            backgroundColor: '#A6A6A6', 
                        }, 
                        ...(selectedButton === 'button1' && {color:'#007cff', backgroundColor:'#FFFFFF !important', width:'100px', height:'45px'})
                    }} 
                    onClick={() => setSelectedButton('button1')}
                >
                    경로 1
                </Button>
                <Button 
                    variant='contained'
                    sx={{
                        backgroundColor:'#C2C2C2', 
                        border:'none', 
                        my:0.5, 
                        width:'90px',
                        fontFamily:'NanumBarunGothicBold',
                        fontSize:'18px',
                        borderTopLeftRadius: '10px', 
                        borderBottomLeftRadius: '10px',
                        '&:hover': {
                            backgroundColor: '#A6A6A6', 
                        }, 
                        ...(selectedButton === 'button2' && {color:'#007cff', backgroundColor:'#FFFFFF !important', width:'100px', height:'45px'})
                    }} 
                    onClick={() => setSelectedButton('button2')}
                >
                    경로 2
                </Button>
                <Button 
                    variant='contained'
                    sx={{
                        backgroundColor:'#C2C2C2', 
                        border:'none', 
                        my:0.5, 
                        width:'90px',
                        fontFamily:'NanumBarunGothicBold',
                        fontSize:'18px',
                        borderTopLeftRadius: '10px', 
                        borderBottomLeftRadius: '10px',
                        '&:hover': {
                            backgroundColor: '#A6A6A6', 
                        }, 
                        ...(selectedButton === 'button3' && {color:'#007cff', backgroundColor:'#FFFFFF !important', width:'100px', height:'45px'})
                    }} 
                    onClick={() => setSelectedButton('button3')}
                >
                    경로 3
                </Button>
            </Box>
            {renderComponent()}
        </div>
    );
};

export default SelectButton;
