import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import MapData from '../assets/maps/counties.min.json'
import MapCenters from '../assets/maps/county-centers-coordinates'

const GISMap = ({ data }) => {
    const [geoJSON, setGeoJSON] = useState(MapData)
    const geoJsonStyles = {
        color: '#000',
        weight: 1,
        fillColor: '#46f',
        fillOpacity: 0.3
    }
    useEffect(() => {
        let mtd = true
        if (mtd) {
            // setGeoJSON(MapData)
        }
        return () => {
            mtd = false
        }
    }, [])
    const onEachFeature = (feature, layer) => {
        layer.bindPopup(`<div className="p-3 w-20 flex flex-col items-start justify-center"><h3>${feature.properties['AREA_CODE']}. ${feature.properties['AREA_NAME']} COUNTY</h3></div>`)
        layer.setStyle({ opacity: Math.random() })
        layer.options.opacity = Math.random()
        layer.options.fillColor = feature.properties.fill
        // layer.options.fillOpacity = feature.properties.fill_opacity
        layer.on(
            {
                click: (e) => {
                    // layer.setStyle({
                    //     color: '#000'
                    // })
                },
            }
        )
        layer.properties = feature.properties
    }
    if (data && data.length > 0) {
        return (
            <>
                <MapContainer center={[-0.818389, 37.477222]} zoom={6.899} maxZoom={15.70} scrollWheelZoom={false} touchZoom={false} style={{ height: '100%', width: "100%", position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px' }}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
                    <GeoJSON data={geoJSON} key={geoJSON} stylez={geoJsonStyles} onEachFeature={onEachFeature} />
                    {data.map((facility, i) => {
                        if (facility && facility?.lat_long && facility?.lat_long.length > 0) {
                            facility.op_stat = facility?.operation_status_name || facility?.status_name
                            return (
                                <Marker position={[facility.lat_long[0], facility.lat_long[1]]} key={facility.id} >
                                    <Popup>
                                        <div className="flex flex-col items-center">
                                            <a href={`/${facility?.facility != undefined && facility?.name.includes('unit') && facility?.facility_name != null ? 'community-unit' : 'facility'}/${facility.id}`} className="text-base uppercase font-semibold text-blue-700 hover:text-black focus:text-black active:text-black">
                                                <span>{facility.official_name || facility.name}</span>
                                            </a>
                                            <div className="text-base flex gap-2 w-full justify-between border-t py-2 items-center">
                                                <h4 className="text-base font-bold text-black flex gap-1"><small className="text-gray-400 text-sm">#</small>{facility?.code || "No code"}</h4>
                                                <span className={"text-sm font-medium drop-shadow-sm rounded leading-none p-1 px-3" + (facility?.op_stat.toLowerCase() == "operational" || facility?.op_stat.toLowerCase().includes('non-') ? "text-blue-900 bg-blue-300/70" : "text-gray-900 bg-gray-200")}>{" " + facility?.op_stat.toString() + " "}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        }
                    })}
                </MapContainer>
            </>
        )
    } else {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold text-gray-600">No facilities found</h1>
            </div>
        )
    }
}

export default GISMap