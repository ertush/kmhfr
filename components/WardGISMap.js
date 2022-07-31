
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker,TileLayer, GeoJSON } from 'react-leaflet'
import MapCenters from '../assets/maps/county-centers-coordinates'
import MapData from '../assets/maps/counties.min.json'

import Alert from '@mui/material/Alert';

const WardGISMap = ({data, markerCoordinates}) => {

    const [county, setCounty] = useState(String((data?.county_name ?? '').toLocaleUpperCase()))
    const [geoJSON, setGeoJSON] = useState(MapData.features.filter(({properties}) => properties.AREA_NAME === county)[0] ?? MapData)
    const mapCenterObj = MapCenters.filter(({name}) => name === county)[0] ?? {longitude: 37.477222 , latitude: -0.818389 }
    // const mapCenter = [, mapCenterObj.longitude]

    // console.log({geoJSON, center})

    const geoJsonStyles = {
        color: '#000',
        weight: 1,
        fillColor: '#46f',
        fillOpacity: 0.3
    }

    useEffect(() => {
        console.log({data, county})
    }, [county, geoJSON, markerCoordinates])

  return (
    <>
    {
        county !== '' ? 
        <>
            {/* Map title */}
            <h3 className='mb-1 text-blue-900 font-normal float-left text-lg'>{county}{" Ward"}</h3>

            {/* Ward Map */}
            <MapContainer center={[Number(mapCenterObj.latitude).toFixed(5), Number(mapCenterObj.longitude).toFixed(5)]} zoom={8.49} maxZoom={15.70} scrollWheelZoom={false} touchZoom={false} style={{ height: '300px', width: "100%", position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px' }}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
                    <GeoJSON data={geoJSON} key={geoJSON} stylez={geoJsonStyles}/>
                    
                        
                    <Marker position={markerCoordinates} >
                        
                    </Marker>
                        
                
                
            </MapContainer>
    </>
    :

        <Alert severity="warning" sx={{width:'100%'}}> No location data found for this facility</Alert>
    }
    </>
  )
}

export default WardGISMap