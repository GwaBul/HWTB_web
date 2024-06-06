import { useEffect, useState } from "react";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import useNavigateToUserLocation from "../../hooks/useNavigaterToUserLocation";
import ArrivalComponent from "../ArrivalComponent";
import userImage from '../../assets/user.png';

import { calculateDistance } from "./calculateDistance";

const { Tmapv3 } = window;

const ResponsiveNavigation = ({ map, user, selectedCoord }) => {
    const { location, error } = useGeoLocation();
    const latitude = location ? location.latitude : null;
    const longitude = location ? location.longitude : null;
    const heading = location ? location.heading : null;
    const [requestData, setRequestData] = useState(null);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [hasArrived, setHasArrived] = useState(true);
    const [userMarker, setUserMarker] = useState(null);

    useNavigateToUserLocation(map, requestData, shouldNavigate);

    const updateNavigation = () => {
        const lonlat = new Tmapv3.LatLng(parseFloat(latitude), parseFloat(longitude));

        user.setMap(null);
        if (userMarker) {
            userMarker.setMap(null);
        }

        var tmapSize = new Tmapv3.Size(40, 40);

        const newUserMarker = new Tmapv3.Marker({
            position: lonlat,
            icon: `${userImage}`,
            iconSize: tmapSize,
            map: map
        });
        
        setUserMarker(newUserMarker);

        const center = new Tmapv3.LatLng(parseFloat(latitude),parseFloat(longitude));
        map.setCenter(center);
        map.setZoom(19);

        if (heading !== null && heading !== undefined) {
            map.setBearing(heading);
        }
    };

    useEffect(() => {
        const currentCoords = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
        const distance = calculateDistance(currentCoords, selectedCoord); 

        if (location) {
            setRequestData({
                startX: location.longitude, // 출발지 x 좌표(경도)
                startY: location.latitude,  // 출발지 y 좌표(위도)
                endX: selectedCoord.lot,           // 도착지 x 좌표(경도)
                endY: selectedCoord.lat,           // 도착지 y 좌표(위도)
                reqCoordType: 'WGS84GEO',   // 요청 좌표 타입
                resCoordType: 'EPSG3857',   // 응답 좌표 타입
                startName: 'User',
                endName: 'Destination',
                searchOption: 10
            });

            updateNavigation();

            if(distance <= 10) {
                setHasArrived(true);
                setShouldNavigate(false); 
            } else {
                return;
            }
        }
    }, [location, latitude, longitude]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            {hasArrived && <ArrivalComponent />}
        </>
    );
};

export default ResponsiveNavigation;
