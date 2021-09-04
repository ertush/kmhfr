import Link from 'next/link'
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import MapData from '../assets/maps/counties.min.json'
import MapCenters from '../assets/maps/county-centers-coordinates'

const GISMap = ({ data }) => {
    if (data && data.length > 0) {
        return (
            <>
                <MapContainer center={[-0.818389, 37.477222]} zoom={6.899} maxZoom={15.70} scrollWheelZoom={false} touchZoom={false} style={{ height: '100%', width: "100%", position: 'relative', zIndex: '1', backgroundColor: '#e7eae8', padding: '15px' }}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
                    <GeoJSON data={MapData} key={MapData} style={`color: '#006400'; weight: 5; opacity: 0.65;`} />
                    {data.map((facility, i) => {
                        if (facility && facility?.lat_long && facility?.lat_long.length > 0) {
                            return (
                                <Marker position={[facility.lat_long[0], facility.lat_long[1]]} key={facility.id} >
                                    <Popup>
                                        <div className="flex flex-col items-center">
                                            <a href={`/facility/${facility.id}`} className="text-base uppercase font-semibold text-blue-700 hover:text-black focus:text-black active:text-black">
                                                <span>{facility.official_name || facility.name}</span>
                                            </a>
                                            <div className="text-base flex gap-2 w-full justify-between border-t py-2 items-center">
                                                <h4 className="text-base font-bold text-black flex gap-1"><small className="text-gray-400 text-sm">#</small>{facility?.code || "No code"}</h4>
                                                <span className={"text-sm font-medium drop-shadow-sm rounded leading-none p-1 px-3" + (facility?.operation_status_name.toLowerCase() == "operational" ? "text-black bg-green-300" : "text-gray-900 bg-gray-200")}>{" " + facility?.operation_status_name.toString() + " "}</span>
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