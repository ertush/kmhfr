import React, { useState, useEffect, useMemo } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { 
  ANALYTICS_FILTER_TREE_DATA, 
  populateTreeDataWithFilters, 
  createInitialSelectedFilters 
} from "../utils/analyticsFilterConfig";

const AnalyticsSideMenu = ({ filters, states, stateSetters, onFiltersChange }) => {
  const [expandedNodes, setExpandedNodes] = useState({
    level: false,
    counties: false,
    facilities: false, 
    services: false,
    ownership: false,
    regulatory_bodies: false,
    infrastructure_categories: false,
    status: false,
    keph_level: false, 
  });

  // Create dynamic tree data and initial filters based on passed filters
  const treeData = useMemo(() => populateTreeDataWithFilters(filters), [filters]);
  const initialFilters = useMemo(() => createInitialSelectedFilters(filters), [filters]);
  
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);

  // Update selected filters when filters prop changes
  useEffect(() => {
    setSelectedFilters(createInitialSelectedFilters(filters));
  }, [filters]);

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
    let newFilters;
    
    if (isLevel) {
      setSelectedFilters((prev) => {
        newFilters = { ...prev };
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
      setSelectedFilters((prev) => {
        newFilters = { ...prev, [nodeId]: !prev[nodeId] };
        return newFilters;
      });
    }

    // Call the callback function if provided
    if (onFiltersChange) {
      setTimeout(() => {
        onFiltersChange(newFilters, filterKey, filterValue, nodeId);
      }, 0);
    }
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
