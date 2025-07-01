import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDownIcon, ChevronRightIcon, SearchIcon } from "@heroicons/react/outline";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
          options: filters[categoryKey].results.map(item => {
            // Add parent references for sub_counties and wards as per your API structure
            if (categoryKey === "sub_counties") {
              return {
                id: item.id,
                text: item.name,
                filterKey: categoryKey,
                filterValue: item.id,
                county: item.county || item.county_id,
              };
            }
            if (categoryKey === "wards") {
              return {
                id: item.id,
                text: item.name,
                filterKey: categoryKey,
                filterValue: item.id,
                sub_county: item.sub_county || item.sub_county_id,
              };
            }
            return {
              id: item.id,
              text: item.name,
              filterKey: categoryKey,
              filterValue: item.id,
            };
          }),
          nextPageUrl: filters[categoryKey].next,
          currentPage: filters[categoryKey].current_page || 1,
          totalPages: filters[categoryKey].total_pages || 1,
          pageSize: filters[categoryKey].page_size || 400,
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

  // Build a nested tree: County > Subcounty > Ward
  const buildCountyTree = () => {

    const counties = dynamicFilterOptions.counties?.options || [];
    const subCounties = dynamicFilterOptions.sub_counties?.options || [];
    const wards = dynamicFilterOptions.wards?.options || [];

    const subCountiesByCounty = {};
    subCounties.forEach(sc => {
      if (!subCountiesByCounty[sc.county]) subCountiesByCounty[sc.county] = [];
      subCountiesByCounty[sc.county].push(sc);
    });

    const wardsBySubCounty = {};
    wards.forEach(w => {
      if (!wardsBySubCounty[w.sub_county]) wardsBySubCounty[w.sub_county] = [];
      wardsBySubCounty[w.sub_county].push(w);
    });

    // Build the nested structure
    return counties.map(county => ({
      ...county,
      children: (subCountiesByCounty[county.id] || []).map(subCounty => ({
        ...subCounty,
        children: wardsBySubCounty[subCounty.id] || [],
      })),
    }));
  };
  // --- End: Custom tree structure for Counties/Subcounties/Wards ---

  // Custom treeData with nested counties
  const treeData = useMemo(() => {
    return ANALYTICS_FILTER_TREE_DATA.map(node => {
      if (node.id === "counties") {
        // Replace counties node with nested structure
        return {
          ...node,
          children: buildCountyTree(),
        };
      }
      // Remove sub_counties and wards as top-level nodes
      if (["sub_counties", "wards"].includes(node.id)) {
        return null;
      }
      const dynamicChildren = dynamicFilterOptions[node.filterCategory]?.options || [];
      return {
        ...node,
        children: dynamicChildren.length > 0 ? dynamicChildren : node.children || [],
      };
    }).filter(Boolean);
  }, [ANALYTICS_FILTER_TREE_DATA, dynamicFilterOptions]);

  // Filter tree nodes and children based on search term
  const filteredTreeData = useMemo(() => {
    if (!searchTerm.trim()) return treeData;
    const lower = searchTerm.toLowerCase();
    return treeData
      .map(node => {
        // Check if node or any child matches
        const nodeMatches = node.text.toLowerCase().includes(lower);
        const filteredChildren = (node.children || []).filter(child =>
          child.text.toLowerCase().includes(lower)
        );
        if (nodeMatches || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [treeData, searchTerm]);

  // Helper: get all descendant ids recursively
  const getAllDescendantIds = (node) => {
    let ids = [node.id];
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        ids = ids.concat(getAllDescendantIds(child));
      });
    }
    return ids;
  };

  // Helper: check if all children are selected
  const areAllChildrenSelected = (node, selectedFilters) => {
    if (!node.children || node.children.length === 0) return !!selectedFilters[node.id];
    return node.children.every(child => areAllChildrenSelected(child, selectedFilters));
  };

  // Helper: check if some children are selected (for indeterminate state)
  const areSomeChildrenSelected = (node, selectedFilters) => {
    if (!node.children || node.children.length === 0) return !!selectedFilters[node.id];
    return node.children.some(child => areSomeChildrenSelected(child, selectedFilters));
  };
  // Helper: flatten the tree structure for search results
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
  // Recursive rendering for nested tree with expand/collapse
  const renderTreeChildren = (children, parentNodeId) => {
    if (!children) return null;
    return (
      <ul className="ml-4 border-l border-gray-200">
        {children.map(child => {
          const allSelected = areAllChildrenSelected(child, selectedFilters);
          const someSelected = areSomeChildrenSelected(child, selectedFilters);
          return (
            <li key={child.id} className="py-1">
              <div className="flex items-center group">
                {/* Expand/collapse arrow if has children */}
                {child.children && child.children.length > 0 ? (
                  <button
                    type="button"
                    className="mr-1 focus:outline-none"
                    onClick={() => toggleNode(child.id)}
                    aria-label={expandedNodes[child.id] ? "Collapse" : "Expand"}
                  >
                    {expandedNodes[child.id] ? (
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                ) : (
                  <span className="w-4 h-4 mr-1" />
                )}
                <input
                  type="checkbox"
                  id={child.id}
                  checked={allSelected}
                  ref={el => {
                    if (el) el.indeterminate = !allSelected && someSelected;
                  }}
                  onChange={() => {
                    // If parent, check/uncheck all descendants
                    const descendantIds = getAllDescendantIds(child);
                    const newFilters = { ...selectedFilters };
                    const shouldCheck = !allSelected;
                    descendantIds.forEach(id => {
                      newFilters[id] = shouldCheck;
                    });
                    setSelectedFilters(newFilters);
                    if (onFiltersChange) {
                      onFiltersChange(newFilters, child.filterKey, child.filterValue, child.id);
                    }
                  }}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                />
                <label
                  htmlFor={child.id}
                  className="cursor-pointer select-none text-gray-700 group-hover:text-blue-700"
                >
                  {child.text}
                </label>
              </div>
              {/* Render children recursively if present and expanded */}
              {child.children && child.children.length > 0 && expandedNodes[child.id] && (
                renderTreeChildren(child.children, child.id)
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Analytics Filters</h3>
      {/* Search Field */}
      <div className="mb-3 relative">
        <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
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
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && searchResults.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full">
            {searchResults.map((result) => (
              <li 
              key={result.id} 
              className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => {
                const newFilters = { ...selectedFilters };
                newFilters[result.id] = !newFilters[result.id];
                setSelectedFilters(newFilters);
                if (onFiltersChange) {
                  onFiltersChange(newFilters, result.filterKey, result.filterValue, result.id);
                }
              }}
              >
                {result.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tree-menu max-h-96 overflow-y-auto">
        {filteredTreeData.length === 0 ? (
          <div className="text-gray-500 text-sm px-2 py-4">No filters found.</div>
        ) : (
          <ul>
            {filteredTreeData.map((node) => {
              const allSelected = areAllChildrenSelected(node, selectedFilters);
              const someSelected = areSomeChildrenSelected(node, selectedFilters);
              return (
                <li key={node.id} className="mb-1">
                  <div className="flex items-center group">
                    {/* Expand/collapse arrow if has children */}
                    {node.children && node.children.length > 0 ? (
                      <button
                        type="button"
                        className="mr-1 focus:outline-none"
                        onClick={() => toggleNode(node.id)}
                        aria-label={expandedNodes[node.id] ? "Collapse" : "Expand"}
                      >
                        {expandedNodes[node.id] ? (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    ) : (
                      <span className="w-5 h-5 mr-1" />
                    )}
                    <input
                      type="checkbox"
                      id={node.id}
                      checked={allSelected}
                      ref={el => {
                        if (el) el.indeterminate = !allSelected && someSelected;
                      }}
                      onChange={() => {
                        const descendantIds = getAllDescendantIds(node);
                        const newFilters = { ...selectedFilters };
                        const shouldCheck = !allSelected;
                        descendantIds.forEach(id => {
                          newFilters[id] = shouldCheck;
                        });
                        setSelectedFilters(newFilters);
                        if (onFiltersChange) {
                          onFiltersChange(newFilters, node.filterKey, node.filterValue, node.id);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
                    />
                    <label
                      htmlFor={node.id}
                      className="cursor-pointer select-none text-gray-900 group-hover:text-blue-700 font-medium"
                    >
                      {node.text}
                    </label>
                  </div>
                  {/* Render children recursively if present and expanded */}
                  {node.children && node.children.length > 0 && expandedNodes[node.id] && (
                    renderTreeChildren(node.children, node.id)
                  )}
                </li>
              );
            })}
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
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          onClick={() => {
            // Clear all filters
            setSelectedFilters(Object.fromEntries(Object.keys(selectedFilters).map(k => [k, false])));
            setSearchTerm("");
            setExpandedNodes({
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
            // Restore FacilityMatrixTable to initial state
            if (onFiltersChange) {
              onFiltersChange(
                Object.fromEntries(Object.keys(selectedFilters).map(k => [k, false])),
                null,
                null,
                null,
                { resetTable: true }
              );
            }
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default AnalyticsSideMenu;