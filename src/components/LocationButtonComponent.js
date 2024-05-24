import { Button } from "@mui/material";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import React from 'react';
import '../components/css/locationButton.css';

const LocationButton = ({ moveToUserLocation }) => {
    return (
        <div className="loc-btn">
            <Button variant="primary" sx={{
                justifyContent: 'center', py: '16px', backgroundColor: 'white', 
                '&:hover': {
                    backgroundColor: 'white', 
                },
                '&:active': {
                    backgroundColor: 'white', 
                },
                '&:focus': {
                    backgroundColor: 'white', 
                }, zIndex: '999',boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', borderRadius:7}} onClick={moveToUserLocation}>
                <MyLocationIcon color="primary" sx={{fontSize:'30px'}} />
                </Button>
        </div >
    );
};

export default LocationButton;