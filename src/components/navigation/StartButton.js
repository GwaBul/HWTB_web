import { Button, Card } from '@mui/material';
import React from 'react';
import './css/StartButton.css';

const StartButton = ({onClick}) => {
    return (
        <div className="start-btn">
            <Card sx={{ backgroundColor:'rgb(0, 124, 255)', width: 130, borderRadius: 5, textAlign:'center'}}>
                <Button  onClick={onClick} sx={{fontFamily:'NanumBarunGothicBold',fontSize:'18px', color:'white'}} >길찾기 시작</Button>
            </Card>
        </div>
    );
};

export default StartButton;