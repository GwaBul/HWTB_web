import { Box, Card, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './css/WarningComponent.css';

const ArrivalComponent = () => {
    const [count, setCount] = useState(5);

    useEffect(() => {
        if (count === 0) {
            window.location.reload(); // 페이지 새로고침
            return;
        }

        const timerId = setTimeout(() => {
            setCount(count - 1);
        }, 1000);

        return () => clearTimeout(timerId);
    }, [count]);

    return (
        <div className="warn-modal">
            <Card sx={{ width: 300, borderRadius: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1 }}>
                    <Typography sx={{ fontFamily: "NanumBarunGothicBold", fontSize: '20px', px: 1 }}>
                        안내를 종료합니다.
                        <Typography sx={{ fontFamily: "NanumBarunGothicBold", fontSize: '15px', px: 1, color:'grey' }}>
                            ({count}초 후에 종료됩니다)
                        </Typography>
                    </Typography>
                </Box>
                <hr />
                <Typography sx={{ fontFamily: "NanumBarunGothicLight", textAlign: 'center', p: 2 }}>
                    하천 주변은 여전히 위험합니다.<br />지금 당장 하천을 벗어나주세요.
                </Typography>
            </Card>
        </div>
    );
};

export default ArrivalComponent;
