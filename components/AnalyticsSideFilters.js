import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline";

const AnalyticsSideMenu = ({ filters, states, stateSetters }) => {
  const [expandedNodes, setExpandedNodes] = useState({
    level: false, // Changed to false
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

  // ... rest of your treeData remains exactly the same ...
  const treeData = [
    {
      id: "level",
      text: "Level",
      children: [
        {
          id: "national",
          text: "National",
          filterKey: "national",
        },
        {
          id: "county",
          text: "County",
          filterKey: "county",
        },
        {
          id: "sub-county",
          text: "Sub County",
          filterKey: "sub_county",
        },
        {
          id: "ward",
          text: "Ward",
          filterKey: "ward",
        },
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
        // Unselect all level options
        newFilters.national = false;
        newFilters.county = false;
        newFilters["sub-county"] = false;
        newFilters.ward = false;
        // Then select the clicked one
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

  return (
    <div className="w-full bg-white shadow-md rounded-md p-4">
      <h3 className="text-lg font-semibold mb-4">Analytics Filters</h3>
      <div className="tree-menu space-y-2">
        {treeData.map((node) => (
          <div key={node.id} className="tree-node">
            <div
              className="tree-node-header flex items-center cursor-pointer py-1 hover:bg-gray-100"
              onClick={() => toggleNode(node.id)}
            >
              {expandedNodes[node.id] ? (
                <ChevronDownIcon className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">{node.text}</span>
            </div>

            {expandedNodes[node.id] && (
              <div className="tree-node-children ml-6 space-y-1 mt-1">
                {node.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center py-1 px-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      id={child.id}
                      checked={selectedFilters[child.id]}
                      onChange={() =>
                        handleCheckboxChange(
                          child.id,
                          child.filterKey,
                          child.filterValue,
                          node.id === "level"
                        )
                      }
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <label
                      htmlFor={child.id}
                      className="cursor-pointer select-none"
                    >
                      {child.text}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
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
                const filter = treeData
                  .flatMap((n) => n.children)
                  .find((c) => c.id === filterId);
                return (
                  <li key={filterId} className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {filter?.text}
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AnalyticsSideMenu;
