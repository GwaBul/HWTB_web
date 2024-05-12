import React, { useState } from 'react';
import { Button, Card, CardContent, Collapse, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import './css/Header.css'

const Header = () => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="header">
            <Card className="cardStyle" sx={{ position: 'relative', justifyContent: 'center', zIndex: '999', maxWidth: 600, marginLeft: 7 }}>
                <div style={{display:'flex'}}>
                    <Typography variant='h5' sx={{ fontFamily: "NanumBarunGothicBold", display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1, pr: 0 }}>
                        실시간 하천 수위 확인
                    </Typography>
                    <Button onClick={handleExpandClick} sx={{ width: 15, px: 0 }}>{expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</Button>
                </div>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Card>
                        <CardContent>
                            <Typography paragraph>여기에 원하는 정보를 나타내세요.</Typography>
                        </CardContent>
                    </Card>
                </Collapse>
            </Card>

        </div>
    );
}

export default Header;
