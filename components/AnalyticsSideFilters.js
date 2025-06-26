import React, { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, SearchIcon, FilterIcon } from "@heroicons/react/outline";
import { FaSpinner } from "react-icons/fa";
// import {LoadingAnimation} from "./LoadingAnimation";
import { text } from "@fortawesome/fontawesome-svg-core";
import { flatten } from "underscore";
import { useSearchParams } from "next/navigation";
import countiesJson from "../assets/orgunits/counties.json";
import subCountiesJson from "../assets/orgunits/subcounties.json";
import wardsJson from "../assets/orgunits/wards.json";

const AnalyticsSideMenu = ({ filters, states, stateSetters, props, onApplyFilters }) => {
 
  // const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [expandedNodes, setExpandedNodes] = useState({
    level: false, // Changed to false
    county: false,
    national: false,
    facilities: false, // Changed to false
    services: false,
    ownership: false,
    status: false,
    keph_level: false, // Added for the new KEPH Level section
  });


  const [selectedFilters, setSelectedFilters] = useState({
    // Level
    national: false,
    county: false,
    "sub-county": false,
    ward: false, // Added for the new Ward option
    // Facilities Analysis
    "by-level": false,
    "medical-clinical": false,
    "stand-alone": false,
    "medical-Center": false,
    "health-Center": false,
    "nursing-home": false,
    "primary-care-hospitals": false,
    "secondary-care-hospitals": false,
    "tertiary-referral-hospitals": false,
    // Services Analysis
    "by-service-category": false,
    "by-service-availability": false,
    // Ownership
    public: false, // Changed from government to public
    private: false,
    "faith-based": false,
    ngo: false, // Added for the new NGO option
    // Status
    operational: false,
    "non-operational": false,
    // KEPH Level
    "keph-level-2": false,
    "keph-level-3": false,
    "keph-level-4": false,
    "keph-level-5": false,
    "keph-level-6": false,
  });

  const [countyData, setCountyData] = useState([]);
  const [subCountyData, setSubCountyData] = useState([]);
  const [wardData, setWardData] = useState([]);
  // const [facilityData, setFacilityData] = useState([]);

  useEffect(() => {

   setCountyData(countiesJson);
   setSubCountyData(subCountiesJson);
   setWardData(wardsJson);

  }, []);


  // console.log("County Data:", countyData);
  // console.log("Sub-County Data:", subCountyData);
  // console.log("Ward Data:", wardData); 
  
  const counties = countyData.map((county) => ({
    id: county.id,
    text: county.name,
    filterKey: "county",
    filterValue: county.name,
    children: subCountyData
      .filter((subCounty) => subCounty.county === county.id)
      .map((subCounty) => ({
        id: subCounty.id,
        text: subCounty.name,
        filterKey: "sub-county",
        filterValue: subCounty.name,
        children: wardData
          .filter((ward) => ward.sub_county === subCounty.id)
          .map((ward) => ({
            id: ward.id,
            text: ward.name,
            filterKey: "ward",
            filterValue: ward.name,
          })),
      })),
  }));

  const treeData = [
    {
      id: "level",
      text: "Level",
      children: [
        {
          id: "national",
          text: "National",
          filterKey: "national",
          filterValue: "National",
          children: counties.map((county) => ({
            id: county.id,
            text: county.text,
            filterKey: "county",
            filterValue: county.name,
            children: county.children.map((subCounty) => ({
              id: subCounty.id,
              text: subCounty.text,
              filterKey: "sub-county",
              filterValue: subCounty.filterValue,
              children: subCounty.children.map((ward) => ({
                id: ward.id,
                text: ward.text,
                filterKey: "ward",
                filterValue: ward.filterValue,
              })),
            })),
          })),
        }
      ],
    },
    {
      id: "facilities",
      text: "Facilities Types",
      children: [
        {
          id: "by-level",
          text: "Dispensary",
          filterKey: "facility_type",
        },
        {
          id: "medical-clinical",
          text: "Medical Clinic",
          filterKey: "facility_type",
        },
        {
          id: "stand-alone",
          text: "Stand Alone",
          filterKey: "facility_type",
        },
        {
          id: "medical-Center",
          text: "Medical Center",
          filterKey: "facility_type",
        },
        {
          id: "health-Center",
          text: "Health Center",
          filterKey: "health_center",
        },
        {
          id: "nursing-home",
          text: "Nursing Home",
          filterKey: "facility_type",
        },
        {
          id: "primary-care-hospitals",
          text: "Primary Care Hospitals",
          filterKey: "facility_type",
        },
        {
          id: "secondary-care-hospitals",
          text: "Secondary Care Hospitals",
          filterKey: "facility_type",
        },
        {
          id: "tertiary-referral-hospitals",
          text: "Tertiary Referral Hospitals",
          filterKey: "facility_type",
        },
      ],
    },
    {
      id: "services",
      text: "Services Analysis",
      children: [
        {
          id: "by-service-category",
          text: "By Service Category",
          filterKey: "service_category",
        },
        {
          id: "by-service-availability",
          text: "By Service Availability",
          filterKey: "service_availability",
        },
      ],
    },
    {
      id: "ownership",
      text: "By Ownership",
      children: [
        {
          id: "public",
          text: "Public",
          filterKey: "owner_type",
          filterValue: "Public",
        },
        {
          id: "private",
          text: "Private",
          filterKey: "owner_type",
          filterValue: "Private",
        },
        {
          id: "faith-based",
          text: "Faith-Based",
          filterKey: "owner_type",
          filterValue: "Faith Based",
        },
        {
          id: "ngo",
          text: "NGO",
          filterKey: "ngo",
          filterValue: "NGO",
        },
      ],
    },
    {
      id: "status",
      text: "By Operation Status",
      children: [
        {
          id: "operational",
          text: "Operational",
          filterKey: "operation_status",
          filterValue: "Operational",
        },
        {
          id: "non-operational",
          text: "Non-Operational",
          filterKey: "operation_status",
          filterValue: "Non Operational",
        },
      ],
    },
    {
      id: "keph_level",
      text: "By KEPH Level",
      children: [
        {
          id: "keph-level-2",
          text: "KEPH Level 2",
          filterKey: "keph_level",
          filterValue: "keph_level_2",
        },
        {
          id: "keph-level-3",
          text: "KEPH Level 3",
          filterKey: "keph_level",
          filterValue: "keph_level_3",
        },
        {
          id: "keph-level-4",
          text: "KEPH Level 4",
          filterKey: "keph_level",
          filterValue: "keph_level_4",
        },
        {
          id: "keph-level-5",
          text: "KEPH Level 5",
          filterKey: "keph_level",
          filterValue: "keph_level_5",
        },
        {
          id: "keph-level-6",
          text: "KEPH Level 6",
          filterKey: "keph_level",
          filterValue: "keph_level_6",
        },
      ],
    },
  ];

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleCheckboxChange = (
    nodeId,
    filterKey,
    filterValue,
    isLevel = false
  ) => {
    // If this is a level selection, unselect all other level options
    if (isLevel) {
      setSelectedFilters((prev) => {
        const newFilters = { ...prev };
        Object.keys(newFilters).forEach((k) => {
          if (["national", "county", "sub-county", "ward"].includes(k))
            newFilters[k] = false;
        });
        // Unselect all level options
        newFilters[nodeId] = !prev[nodeId];
        return newFilters;
      });
    } else {
      // For non-level options, just toggle normally
      setSelectedFilters((prev) => ({
        ...prev,
        [nodeId]: !prev[nodeId],
      }));
    }

    // Here you would typically update your filters state
    // For example:
    // stateSetters[0]({...states[0], [filterKey]: filterValue});
    // Or trigger a filter update in your parent component
  };

  // Helper to get only selected filters with their keys and values
  const getSelectedFilters = () => {
    const selected = {};
    treeData.forEach((section) => {
      section.children.forEach((child) => {
        if (selectedFilters[child.id]) {
          selected[child.filterKey] = child.filterValue || true;
        }
        // Recursively check children
        if (child.children) {
          child.children.forEach((sub) => {
            if (selectedFilters[sub.id]) {
              selected[sub.filterKey] = sub.filterValue || true;
            }
            if (sub.children) {
              sub.children.forEach((ward) => {
                if (selectedFilters[ward.id]) {
                  selected[ward.filterKey] = ward.filterValue || true;
                }
              });
            }
          });
        }
      });
    });
    return selected;
  };

  // Helper: recursively find a node by id in the tree
  const findNodeById = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper: recursively flatten all nodes in the tree
  const flattenTree = (nodes) => {
    let result = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children) {
        result = result.concat(flattenTree(node.children));
      }
    }
    return result;
  };

  // Recursive tree node renderer
  const renderTreeNodes = (nodes, parentNodeId = null) => {
    if (!nodes) return null;
    return nodes.map((node) => (
      <div key={node.id} className="tree-node">
        <div className="flex items-center py-1 px-2 hover:bg-gray-50 rounded">
          <input
            type="checkbox"
            id={node.id}
            checked={!!selectedFilters[node.id]}
            onChange={() =>
              handleCheckboxChange(
                node.id,
                node.filterKey,
                node.filterValue,
                parentNodeId === "level"
              )
            }
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
          />
          <label htmlFor={node.id} className="cursor-pointer select-none">
            {node.text}
          </label>
          {node.children && node.children.length > 0 && (
            <span
              className="ml-auto cursor-pointer"
              onClick={() => toggleNode(node.id)}
            >
              {expandedNodes[node.id] ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
        {node.children &&
          node.children.length > 0 &&
          expandedNodes[node.id] && (
            <div className="ml-6">{renderTreeNodes(node.children, node.id)}</div>
          )}
      </div>
    ));
  };

  // Apply button handler with loading state
  const handleApply = async () => {
    setLoading(true);
    try {
      const filters = getSelectedFilters();
      if (onApplyFilters) {
        // If onApplyFilters is async, await it
        await onApplyFilters(filters);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-md p-4">
      <h3 className="text-lg font-semibold mb-4">Analytics Filters</h3>
      <div className="flex items-center mb-4">
        <FilterIcon className='w-6 h-6 text-gray-900' />
        <span className="ml-2 text-sm text-gray-600">Filter by:</span>
      </div>
      <div className="tree-menu space-y-2">
        {renderTreeNodes(treeData)}
      </div>
      {/* Search bar */}
      <div className="mt-4">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search filters..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              const lowerCaseTerm = e.target.value.toLowerCase();
              const allNodes = flattenTree(treeData);
              const results = allNodes.filter(
                (node) => node.text && node.text.toLowerCase().includes(lowerCaseTerm)
              );
              setSearchResults(results);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {searchTerm && searchResults.length > 0 && (
          <ul className="mt-2 bg-white border border-gray-200 rounded-md shadow-md max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  handleCheckboxChange(
                    result.id,
                    result.filterKey,
                    result.filterValue,
                    result.filterKey === "level"  // Assuming 'level' is a special case
                  );
                }}
              >
                {result.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected filters summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-sm mb-2">Selected Filters:</h4>
        {Object.entries(selectedFilters).filter(([_, isSelected]) => isSelected)
          .length === 0 ? (
          <p className="text-gray-500 text-sm">No filters selected</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {Object.entries(selectedFilters)
              .filter(([_, isSelected]) => isSelected)
              .map(([filterId]) => {
                const filter = findNodeById(treeData, filterId);
                return (
                  <li key={filterId} className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {filter?.text?.toString() || filterId}
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      {/* Apply Button */}
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
        onClick={handleApply}
        disabled={loading}
      >
        {loading && (
          <FaSpinner className="animate-spin mr-2" />
        )}
        Apply
      </button>
      <button
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        onClick={() => {
          setSelectedFilters(Object.fromEntries(Object.keys(selectedFilters).map(k => [k, false])));
          setExpandedNodes({
            level: false,
            county: false,
            national: false,
            facilities: false,
            services: false,
            ownership: false,
            status: false,
            keph_level: false,
          });
        }}
        disabled={loading}
      >
        Clear
      </button>
    </div>
  );
};

export default AnalyticsSideMenu;
