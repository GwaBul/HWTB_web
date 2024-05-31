import { Box, Card, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import React from 'react';
import './css/WarningComponent.css';

const ArrivalComponent = () => {
    return (
        <div className="warn-modal">
            <Card sx={{ width: 300, borderRadius:5 }}>
                <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', p:1}}>
                    <Typography sx={{ fontFamily: "NanumBarunGothicBold", fontSize:'20px',px:1 }}>안내를 종료합니다.</Typography>
                </Box>
                <hr />
                <Typography sx={{ fontFamily: "NanumBarunGothicLight", textAlign:'center',p: 2  }}>하천 주변은 여전히 위험합니다.<br />지금 당장 하천을 벗어나주세요.</Typography>
            </Card>
        </div>
    );
};

export default ArrivalComponent;