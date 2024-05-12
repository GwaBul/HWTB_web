import { Button } from "@mui/material";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import React from 'react';
import './css/LocationButton.css';

const LocationButton = ({moveToUserLocation}) => {
    
    return (
        <div className="loc-btn">
            <Button variant="primary" sx={{ justifyContent: 'center', width: '20px', backgroundColor: '#FFFFFF', zIndex: '999',boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'  }} onClick={moveToUserLocation}><MyLocationIcon color="primary" /></Button>
        </div>
    );
};

export default LocationButton;