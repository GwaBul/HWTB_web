import { useEffect, useState } from "react";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import useNavigateToUserLocation from "../../hooks/useNavigaterToUserLocation";
import SelectButton from "./SelectButton";
import StartButton from "./StartButton";
import InfoComponent from "../InfoComponent";

const { Tmapv3 } = window;
const dummyUserMovement = [
    {
        startX: '128.333607',
        startY: '36.124802',
    },
    {
        startX: '128.333649',
        startY: '36.124821',
    },
    {
        startX: '128.333720',
        startY: '36.124825',
    },
    {
        startX: '128.333867',
        startY: '36.124844',
    },
    {
        startX: '128.333957',
        startY: '36.124871',
    },
    {
        startX: '128.334074',
        startY: '36.124875',
    },
    {
        startX: '128.334231',
        startY: '36.124957',
    },

]

// GPS 이용 코드
// const NavigationComponent = ({ map }) => {
//     const { location, error } = useGeoLocation();
//     const [requestData, setRequestData] = useState(null);
//     const [currentIndex, setCurrentIndex] = useState(0);

//     useEffect(() => {
//       if (location) {
//         setRequestData({
//           startX: location.longitude, // 출발지 x 좌표(경도)
//           startY: location.latitude,  // 출발지 y 좌표(위도)
//           endX: 128.334231,           // 도착지 x 좌표(경도)
//           endY: 36.124957,           // 도착지 y 좌표(위도)
//           reqCoordType: 'WGS84GEO',   // 요청 좌표 타입
//           resCoordType: 'EPSG3857',   // 응답 좌표 타입
//           startName: 'User',
//           endName: 'Destination',
//           searchOption: 10
//         });
//       }
//     }, [location]);

//     useNavigateToUserLocation(map, requestData);

//     if (error) {
//       return <div>{error}</div>;
//     }

//     return(
//         <>
//             <SelectButton/>
//             <InfoComponent/>
//             <StartButton/>
//         </>
//     );
//   };

const NavigationComponent = ({ map, user }) => {
    const [requestData, setRequestData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    
    useNavigateToUserLocation(map, requestData, shouldNavigate);

    // 사용자 위치 설정과 요청 데이터 업데이트를 동시에 처리하는 함수
    const updateNavigation = (currentMovement) => {
        const lonlat = new Tmapv3.LatLng(currentMovement.startY, currentMovement.startX);
        user.setPosition(lonlat); // 사용자 위치 설정

        setRequestData({
            startX: currentMovement.startX,
            startY: currentMovement.startY,
            endX: '128.334231',
            endY: '36.124957',
            reqCoordType: 'WGS84GEO',
            resCoordType: 'EPSG3857',
            startName: 'User',
            endName: 'Destination',
            searchOption: 10
        });
    };

    useEffect(() => {
        if (currentIndex < dummyUserMovement.length) {
            const interval = setInterval(() => {
                const currentMovement = dummyUserMovement[currentIndex];
                updateNavigation(currentMovement); // 위치 설정과 요청 데이터 업데이트
                setShouldNavigate(true);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setShouldNavigate(false); // 모든 이동이 완료되면 경로 그리기 중지
        }
    }, [currentIndex, user]);

    return null;
};


export default NavigationComponent;
