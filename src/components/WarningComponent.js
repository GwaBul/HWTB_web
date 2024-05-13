import { Box, Card, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import React from 'react';
import './css/WarningComponent.css';

const WarningComponent = () => {
    return (
        <div className="warn-modal">
            <Card sx={{ width: 300, borderRadius:5 }}>
                <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', p:1}}>
                    <WarningIcon sx={{ color: 'red', fontSize: '30px'}} />
                    <Typography sx={{ fontFamily: "NanumBarunGothicBold", fontSize:'20px',px:1 }}>호우주의보 발령!</Typography>
                </Box>
                <hr />
                <Typography sx={{ fontFamily: "NanumBarunGothicLight", textAlign:'center',p: 2  }}>지금 당장 하천에서 벗어나세요!<br />하천범람의 위험이 있습니다.</Typography>
            </Card>
        </div>
    );
};

export default WarningComponent;