import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline";
import { 
  ANALYTICS_FILTER_TREE_DATA, 
  populateTreeDataWithFilters, 
  createInitialSelectedFilters 
} from "../utils/analyticsFilterConfig";
import { fetchPaginatedFilterOptions } from "../utils/filterApi";


const AnalyticsSideMenu = ({ filters, authToken, onFiltersChange }) => {
  const [expandedNodes, setExpandedNodes] = useState({
    level: false,
    counties: false,
    sub_counties: false,
    wards: false,
    facility_types: false,
    services: false,
    ownership: false,
    regulatory_bodies: false,
    infrastructure_categories: false,
    status: false,
    keph_level: false, 
  });

  const [dynamicFilterOptions, setDynamicFilterOptions] = useState({});
  const [loadingMore, setLoadingMore] = useState({});

  const initialSelectedFilters = useMemo(() => createInitialSelectedFilters(filters), [filters]);
  const [selectedFilters, setSelectedFilters] = useState(initialSelectedFilters);

  useEffect(() => {
    setSelectedFilters(createInitialSelectedFilters(filters));
  }, [filters]);

  useEffect(() => {
    const initialDynamicState = {};
    const initialLoadingState = {};


    ANALYTICS_FILTER_TREE_DATA.forEach(node => {
      const categoryKey = node.filterCategory;

      if (categoryKey && filters[categoryKey] && filters[categoryKey].results) {
        initialDynamicState[categoryKey] = {
          options: filters[categoryKey].results.map(item => ({
            id: item.id,
            text: item.name,
            filterKey: categoryKey,
            filterValue: item.id,
          })),
          nextPageUrl: filters[categoryKey].next,
          currentPage: filters[categoryKey].current_page || 1,
          totalPages: filters[categoryKey].total_pages || 1,
        };
        initialLoadingState[categoryKey] = false;
      } else if (node.id === 'level') {
        initialDynamicState[categoryKey] = {
          options: node.children.map(child => ({
            id: child.id,
            text: child.text,
            filterKey: child.filterKey,
            filterValue: child.filterValue,
          })),
          nextPageUrl: null,
          currentPage: 1,
          totalPages: 1,
        };
        initialLoadingState[categoryKey] = false;
      } else {
        initialDynamicState[categoryKey] = {
          options: [],
          nextPageUrl: null,
          currentPage: 1,
          totalPages: 1,
        };
        initialLoadingState[categoryKey] = false;
      }
    });
    setDynamicFilterOptions(initialDynamicState);
    setLoadingMore(initialLoadingState);
  }, [filters]);

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleCheckboxChange = (
    childId,
    filterKey,
    filterValue,
    isLevel = false
  ) => {
    let newFilters;
    
    if (isLevel) {
      newFilters = { ...selectedFilters };
      newFilters.national = false;
      newFilters.county = false;
      newFilters["sub-county"] = false;
      newFilters.ward = false;
      newFilters[childId] = !selectedFilters[childId];
    } else {
      // For non-level options, just toggle normally
      newFilters = { ...selectedFilters, [childId]: !selectedFilters[childId] };
    }
    setSelectedFilters(newFilters);

    // Call the callback function if provided
    if (onFiltersChange) {
      // The debounce is handled in the parent component (index.js)
      onFiltersChange(newFilters, filterKey, filterValue, childId);
    }
  };

  const handleLoadMore = useCallback(async (category) => {
    const currentCategoryState = dynamicFilterOptions[category];
    if (!currentCategoryState || !currentCategoryState.nextPageUrl || loadingMore[category]) {
      return;
    }

    setLoadingMore(prev => ({ ...prev, [category]: true }));

    try {
      const url = new URL(currentCategoryState.nextPageUrl);
      const nextPage = url.searchParams.get('page');
      
      // Get the endpoint path from the URL for fetchPaginatedFilterOptions
      const endpointPath = url.pathname; 

      const data = await fetchPaginatedFilterOptions(
        endpointPath, 
        authToken,
        nextPage
      );

      setDynamicFilterOptions(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          options: [
            ...prev[category].options, 
            ...data.results.map(item => ({
              id: item.id,
              text: item.name,
              filterKey: category,
              filterValue: item.id,
            }))
          ],
          nextPageUrl: data.next,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        },
      }));
    } catch (error) {
      console.error(`Error loading more for ${category}:`, error);
    } finally {
      setLoadingMore(prev => ({ ...prev, [category]: false }));
    }
  }, [dynamicFilterOptions, loadingMore, authToken]);

  const treeData = useMemo(() => {
    return ANALYTICS_FILTER_TREE_DATA.map(node => {
      if (node.id === 'level') {
        return node;
      }
      
      const dynamicChildren = dynamicFilterOptions[node.filterCategory]?.options || [];
      
      return {
        ...node,
        children: dynamicChildren.length > 0 ? dynamicChildren : node.children || [],
      };
    });
  }, [ANALYTICS_FILTER_TREE_DATA, dynamicFilterOptions]);


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
                      checked={selectedFilters[child.id] || false}
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
                {/* "Load More" button for paginated categories */}
                {dynamicFilterOptions[node.filterCategory]?.nextPageUrl && (
                  <button
                    onClick={() => handleLoadMore(node.filterCategory)}
                    disabled={loadingMore[node.filterCategory]}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
                  >
                    {loadingMore[node.filterCategory] ? 'Loading...' : 'Load More'}
                  </button>
                )}
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
                const filter = Object.values(dynamicFilterOptions)
                  .flatMap(cat => cat.options)
                  .find(c => c.id === filterId) || 
                  ANALYTICS_FILTER_TREE_DATA
                    .flatMap(n => n.children)
                    .find(c => c.id === filterId);

                return (
                  <li key={filterId} className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {filter?.text || filterId}
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