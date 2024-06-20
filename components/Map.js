import { memo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import   MarkerIcon  from './MarkerIcon'


const Map = ({ operational, lat, long, name, ward_name, code, geoJSON }) => {

    return (
        <MapContainer center={[lat, long]} zoom={9.899} maxZoom={12.70} scrollWheelZoom={false} touchZoom={false} style={{ height: 650, width: "100%", position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px'}}>
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
            <GeoJSON data={geoJSON} key={geoJSON} style={`color: '#006400'; weight: 5; opacity: 0.65;`} />
            <Marker position={[lat, long]} icon={MarkerIcon}>
                <Popup>
                    <div className="flex flex-col items-center">
                        <h4 className="text-sm font-medium text-black">{ward_name}</h4>
                        <h4 className="text-sm font-medium border-t text-black w-full">{name}</h4>
                        <div className="text-base flex gap-2 w-full justify-between border-t py-2 items-center">
                            <h4 className="text-base font-bold text-black flex gap-1"><small className="text-gray-400 text-sm">#</small>{code}</h4>
                            <span className={"text-sm font-medium drop-shadow-sm rounded leading-none p-1 px-3" + (operational.toString().toLowerCase() == "operational" ? "text-black bg-blue-300" : "text-gray-900 bg-gray-200")}>{" " + operational.toString() + " "}</span>
                        </div>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default memo(Map)