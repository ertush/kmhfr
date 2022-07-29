
import React, { useState } from 'react'
import { MapContainer, Marker,TileLayer, GeoJSON } from 'react-leaflet'


const WardGISMap = ({data, markerCoordinates}) => {

    const [center, setCenter] = useState(data?.ward_boundary?.properties?.center?.coordinates ?? [])
    const [geoJSON, setGeoJSON] = useState(data?.ward_boundary ?? {})

    const geoJsonStyles = {
        color: '#000',
        weight: 1,
        fillColor: '#46f',
        fillOpacity: 0.3
    }

  return (
    <>
    {
        data && data?.length > 0 ? 
        <>
            {/* Map title */}
            <h3 className='mb-1 text-blue-900 font-normal text-lg'>{data?.name}{" Ward"}</h3>

            {/* Ward Map */}
            <MapContainer center={center} zoom={6.899} maxZoom={15.70} scrollWheelZoom={false} touchZoom={false} style={{ height: '300px', width: "100%", position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px' }}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
                    <GeoJSON data={geoJSON} key={geoJSON} stylez={geoJsonStyles}/>
                    
                        
                    <Marker position={markerCoordinates} >
                        
                    </Marker>
                        
                
                
            </MapContainer>
    </>
    :
    <div className='w-full rounded bg-yellow-100 flex flex-row gap-2 my-2 p-3 border border-yellow-300 text-yellow-900 text-base leading-none'>
        <p>
            No location data found for this facility.
        </p>
    </div>
    }
    </>
  )
}

export default WardGISMap