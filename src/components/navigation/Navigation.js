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
        startX: '128.333766',
        startY: '36.124904',
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

    useEffect(() => {
        if (!shouldNavigate) return;

        const interval = setInterval(() => {
            if (currentIndex < dummyUserMovement.length) {
                const currentMovement = dummyUserMovement[currentIndex];
                const lonlat = new Tmapv3.LatLng(currentMovement.startY, currentMovement.startX);

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

                if (user) {
                    user.setPosition(lonlat);
                }
                setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
                clearInterval(interval);
                setShouldNavigate(false); // 모든 이동이 완료되면 경로 그리기 중지
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, shouldNavigate, user]);

    // 경로 그리기 시작
    const startNavigation = () => {
        setTimeout(() => {
            setShouldNavigate(true);
            setCurrentIndex(0); // 인덱스 초기화
        }, 0);
    };

    // 경로 중지 및 지우기
    const stopAndClearNavigation = () => {
        setTimeout(() => {
            setShouldNavigate(false);
            setCurrentIndex(0);
            setRequestData(null); // 요청 데이터 초기화
        }, 0);
    };

    // requestData가 바뀔떄마다 useEffect실행되게 해야되는데 상위컴포넌트인 여기는 안걸려있음 그게 문젠가?
    useNavigateToUserLocation(map, requestData, shouldNavigate);

    return (
        <>
            <SelectButton onClick={stopAndClearNavigation} />
            <InfoComponent />
            <StartButton onClick={startNavigation} />
        </>
    );
};

export default NavigationComponent;
