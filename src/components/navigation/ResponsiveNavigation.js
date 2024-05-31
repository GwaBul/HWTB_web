import { useEffect, useState } from "react";
import { useGeoLocation } from "../../hooks/useGeoLocation";
import useNavigateToUserLocation from "../../hooks/useNavigaterToUserLocation";
import SelectButton from "./SelectButton";
import StartButton from "./StartButton";
import InfoComponent from "../InfoComponent";
import ArrivalComponent from "../ArrivalComponent";

const { Tmapv3 } = window;
const dummyUserMovement = [
    {
        startX: '128.3925',
        startY: '36.14534',
    },
    {
        startX: '128.3922',
        startY: '36.14530',
    },
    {
        startX: '128.3920',
        startY: '36.14541',
    },
    {
        startX: '128.3920',
        startY: '36.14554',
    },
    {
        startX: '128.3920',
        startY: '36.14572',
    },
    {
        startX: '128.3919',
        startY: '36.14591',
    },
    {
        startX: '128.3919',
        startY: '36.14611',
    },
    {
        startX: '128.3918',
        startY: '36.14635',
    },
    {
        startX: '128.3918',
        startY: '36.14657',
    },
    {
        startX: '128.3917',
        startY: '36.14681',
    },
    {
        startX: '128.3916',
        startY: '36.14706',
    },
    {
        startX: '128.3916',
        startY: '36.14723',
    },
    {
        startX: '128.3916',
        startY: '36.14748',
    },
    {
        startX: '128.3920',
        startY: '36.14752',
    },
    {
        startX: '128.3925',
        startY: '36.14748',
    },
    {
        startX: '128.3928',
        startY: '36.14746',
    },
    {
        startX: '128.3931',
        startY: '36.14744',
    },
    {
        startX: '128.3934',
        startY: '36.14741',
    },
    {
        startX: '128.3939',
        startY: '36.14737',
    },
    {
        startX: '128.3942',
        startY: '36.14734',
    },
    {
        startX: '128.394656',
        startY: '36.147367',
    }
]

// GPS 이용 코드
// const ResponsiveNavigation = ({ map }) => {
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

const ResponsiveNavigation = ({ map, user }) => {
    const [requestData, setRequestData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const [hasArrived, setHasArrived] = useState(false);

    useNavigateToUserLocation(map, requestData, shouldNavigate);

    // 사용자 위치 설정과 요청 데이터 업데이트를 동시에 처리하는 함수
    const updateNavigation = (currentMovement) => {
        const lonlat = new Tmapv3.LatLng(currentMovement.startY, currentMovement.startX);
        user.setPosition(lonlat); // 사용자 위치 설정
        const center = new Tmapv3.LatLng(parseFloat(currentMovement.startY), parseFloat(currentMovement.startX));
        map.setCenter(center);
        map.setZoom(19);

        setRequestData({
            startX: currentMovement.startX,
            startY: currentMovement.startY,
            endX: '128.394656',
            endY: '36.147367',
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
            setHasArrived(true); // 도착 상태를 true로 설정
        }
    }, [currentIndex, user]);

    return (
        <>
            {hasArrived && <ArrivalComponent />}
        </>
    );
};


export default ResponsiveNavigation;
