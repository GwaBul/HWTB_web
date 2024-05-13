import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import './css/InfoComponent.css';
import InfoIcon from '@mui/icons-material/Info';

const InfoComponent = () => {
    return (
        <div className="info-modal">
            <Card sx={{ width: 320, borderRadius:5 }}>
                <Box sx={{display:'flex', justifyContent:'center', p:2}}>
                    <InfoIcon color="primary"/>
                    <Typography sx={{ fontFamily: "NanumBarunGothicBold", fontSize:'18px',px:1 }}>만약, 주어진 경로를 갈 수 없다면<br/>다른 경로를 선택해주세요.</Typography>
                </Box>
            </Card>
        </div>
    );
};

export default InfoComponent;