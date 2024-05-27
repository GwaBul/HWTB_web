import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import './css/SelectButton.css';
import useNavigateToUserLocation from '../../hooks/useNavigaterToUserLocation';

const SelectButton = ({ map, exitCoord }) => {
    const [selectedButton, setSelectedButton] = useState(0);
    const [requestData, setRequestData] = useState({
        startX: '128.3925537',
        startY: '36.1457981',
        endX: '',
        endY: '',
        reqCoordType: 'WGS84GEO',
        resCoordType: 'EPSG3857',
        startName: 'User',
        endName: 'Destination',
        searchOption: 10
    });
    const shouldNavigate = true;

    useNavigateToUserLocation(map, requestData, shouldNavigate);

    useEffect(()=>{
        console.log(requestData);
    },[requestData])

    useEffect(() => {
        if (exitCoord && exitCoord.length > 0 && selectedButton !== null) {
            const selectedCoord = exitCoord[selectedButton];
            console.log(exitCoord);
            setRequestData(prevState => ({
                ...prevState,
                endX: selectedCoord.x.toString(),
                endY: selectedCoord.y.toString(),
            }));
        }
    }, [exitCoord, selectedButton]);

    const handleButtonClick = (index) => {
        setSelectedButton(index);
        
    }

    const buttons = exitCoord.map((coord, index) => (
        <Button
            key={index}
            variant='contained'
            sx={{
                backgroundColor: '#C2C2C2',
                border: 'none',
                my: 0.5,
                width: '90px',
                fontFamily: 'NanumBarunGothicBold',
                fontSize: '18px',
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px',
                '&:hover': {
                    backgroundColor: '#A6A6A6',
                },
                ...(selectedButton === index && { color: '#007cff', backgroundColor: '#FFFFFF !important', width: '100px', height: '45px' })
            }}
            onClick={() => handleButtonClick(index)}
        >
            {`경로 ${index + 1}`}
        </Button>
    )).slice(0, 3); 

    return (
        <div className="select-btn">
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'end', py: 1, height: '200px' }}>
                {buttons}
            </Box>
        </div>
    );
};

export default SelectButton;
