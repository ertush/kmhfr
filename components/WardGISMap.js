import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, GeoJSON } from 'react-leaflet'
import Alert from '@mui/material/Alert';


const WardGISMap = ({ markerCoordinates, geoJSON, center, ward }) => {



    const [isOutOfBound, setIsOutOfBound] = useState(false)
    const geoJsonStyles = {
        color: '#000',
        weight: 1,
        fillColor: '#46f',
        fillOpacity: 0.3
    }

    useEffect(() => {
        let lngs = []
        let lats = []

        if (geoJSON) {

            geoJSON.properties.bound.coordinates.forEach(([lng, lat]) => {
                lngs.push(lng)
                lats.push(lat)
            })

            let [maxlat, maxlng] = [Math.max(...lats), Math.max(...lngs)];

            if (markerCoordinates[0] !== 0.00000 && markerCoordinates[1] !== 0.00000) {
                if ((markerCoordinates[1] > maxlng) || (markerCoordinates[0] > maxlat)) {
                    setIsOutOfBound(true)
                }
            }
        }


    }, [markerCoordinates, geoJSON])



    return (

        <>

            {/* Map title */}
            <h3 className='mb-1 px-2 text-green-900 font-normal float-left text-lg bg-gray-300 w-full  capitalize'>{String(ward).toLowerCase()}{" ward"}</h3>
            {isOutOfBound && <Alert severity="error" sx={{ width: '100%' }}>The coordinates did not validate</Alert>}

            {/* Ward Map */}
            <MapContainer center={center ?? [-0.44531, 37.1111]} zoom={10.899} maxZoom={15.70} scrollWheelZoom={false} touchZoom={false} style={{ height: '400px', width: "100%", position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px' }}>

                <GeoJSON data={geoJSON} stylez={geoJsonStyles} />

                <Marker position={markerCoordinates}></Marker>

            </MapContainer>
        </>



    )
}

export default WardGISMap