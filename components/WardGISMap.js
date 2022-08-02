import React, { useEffect, useState } from 'react'
import { MapContainer, Marker,TileLayer, GeoJSON } from 'react-leaflet'
// import MapCenters from '../assets/maps/county-centers-coordinates'
// import MapData from '../assets/maps/counties.min.json'


const WardGISMap = ({markerCoordinates, geoJSON, center, ward}) => {

  
   
   
    const geoJsonStyles = {
        color: '#000',
        weight: 1,
        fillColor: '#46f',
        fillOpacity: 0.3
    }

    useEffect(() => {
       

       
    },  [markerCoordinates, geoJSON])



  return (
   
        <>

            {/* Map title */}
            <h3 className='mb-1 ml-2 text-blue-900 font-normal float-left text-lg capitalize'>{String(ward).toLowerCase()}{" ward"}</h3>

            {/* Ward Map */}
            <MapContainer center={ center ?? [-0.44531,  37.1111] } zoom={11.899} maxZoom={15.70} scrollWheelZoom={false} touchZoom={false} style={{ height: '300px', width: "100%", position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px' }}>
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
                <GeoJSON data={geoJSON} stylez={geoJsonStyles}/>

                <Marker position= {markerCoordinates} ></Marker>
                        
            </MapContainer>
        </>

   
    
  )
}

export default WardGISMap