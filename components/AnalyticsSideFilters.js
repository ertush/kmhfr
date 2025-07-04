import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import {
  ANALYTICS_FILTER_TREE_DATA,
  createInitialSelectedFilters,
} from "../utils/analyticsFilterConfig";
import {
  fetchSubCountiesApi,
  fetchWardsApi,
  fetchPaginatedFilterOptions,
  fetchSpecialityDetailsApi,
  fetchInfrastructureDetailsApi,
  fetchServicesDetailsApi,
  fetchFacilityTypeDetailsApi,
} from "../utils/mobiDataApi";

export function getFilterMetaById(
  filterId,
  {
    treeData,
    dynamicFilterOptions,
    serviceDetails,
    specialityDetails,
    infrastructureDetails,
    facilityDetails,
    subCountiesByCounty,
    wardsBySubCounty,
    findNodeInTree,
  },
) {
  let filter =
    findNodeInTree(filterId, treeData) ||
    Object.values(dynamicFilterOptions)
      .flatMap((cat) => cat.options)
      .find((c) => c.id === filterId);

  // Consolidated checks for dynamically loaded children
  if (!filter) {
    filter = Object.values(subCountiesByCounty)
      .flatMap((sc) => sc.options || [])
      .find((opt) => opt.id === filterId);
  }
  if (!filter) {
    filter = Object.values(wardsBySubCounty)
      .flatMap((wc) => wc.options || [])
      .find((opt) => opt.id === filterId);
  }
  if (!filter) {
    filter = Object.values(serviceDetails)
      .flatMap((sd) => sd.options || [])
      .find((opt) => opt.id === filterId);
  }
  if (!filter) {
    filter = Object.values(specialityDetails)
      .flatMap((sd) => sd.options || [])
      .find((opt) => opt.id === filterId);
  }
  if (!filter) {
    filter = Object.values(infrastructureDetails)
      .flatMap((id) => id.options || [])
      .find((opt) => opt.id === filterId);
  }
  if (!filter) {
    filter = Object.values(facilityDetails)
      .flatMap((fd) => fd.options || [])
      .find((opt) => opt.id === filterId);
  }

  return filter;
}

export function buildFilterObject(
  selectedFilters,
  {
    treeData,
    dynamicFilterOptions,
    subCountiesByCounty,
    serviceDetails,
    specialityDetails,
    infrastructureDetails,
    facilityDetails,
    wardsBySubCounty,
    findNodeInTree,
  },
) {
  const filterObj = {};
  const groupingKeys = ["national", "county", "sub-county", "ward"];

  Object.entries(selectedFilters)
    .filter(([_, isSelected]) => isSelected)
    .forEach(([filterId]) => {
      if (groupingKeys.includes(filterId)) return;

      const filter = getFilterMetaById(filterId, {
        treeData: ANALYTICS_FILTER_TREE_DATA,
        dynamicFilterOptions,
        subCountiesByCounty,
        serviceDetails,
        specialityDetails,
        infrastructureDetails,
        facilityDetails,
        wardsBySubCounty,
        findNodeInTree,
      });
      if (filter && filter.filterKey) {
        if (!filterObj[filter.filterKey]) filterObj[filter.filterKey] = [];
        filterObj[filter.filterKey].push(filter.filterValue || filterId);
      }
    });
  return filterObj;
}

const AnalyticsSideMenu = ({ filters, authToken, onFiltersChange }) => {
  const [expandedNodes, setExpandedNodes] = useState({ 
    level: false,
    counties: false,
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
  const [subCountiesByCounty, setSubCountiesByCounty] = useState({});
  const [wardsBySubCounty, setWardsBySubCounty] = useState({});
  const [specialityDetails, setSpecialityDetails] = useState({});
  const [loadingChildren, setLoadingChildren] = useState({});
  const [serviceDetails, setServiceDetails] = useState({});
  const [infrastructureDetails, setInfrastructureDetails] = useState({});
  const [facilityDetails, setFacilityDetails] = useState({});

  const initialSelectedFilters = useMemo(
    () => createInitialSelectedFilters(filters),
    [filters],
  );
  const [selectedFilters, setSelectedFilters] = useState(
    initialSelectedFilters,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setSelectedFilters(createInitialSelectedFilters(filters));
  }, [filters]);

  useEffect(() => {
    const initializeDynamicFilters = async () => {
      const initialDynamicState = {};
      const initialLoadingState = {};

      for (const node of ANALYTICS_FILTER_TREE_DATA) {
        if (!node.isDynamic && node.id !== "grouping") continue;

        const categoryKey = node.filterCategory || node.id;

        if (
          categoryKey &&
          filters[categoryKey] &&
          filters[categoryKey].results
        ) {
          initialDynamicState[categoryKey] = {
            options: filters[categoryKey].results.map((item) => ({
              id: item.id,
              text: item.name,
              filterKey: categoryKey,
              filterValue: item.id,
            })),
            nextPageUrl: filters[categoryKey].next,
            currentPage: filters[categoryKey].current_page || 1,
            totalPages: filters[categoryKey].total_pages || 1,
            pageSize: filters[categoryKey].page_size || 400,
          };
          initialLoadingState[categoryKey] = false;
        } else if (node.id === "grouping") {
          initialDynamicState[node.id] = {
            options: node.children.map((child) => ({
              id: child.id,
              text: child.text,
              filterKey: child.filterKey,
              filterValue: child.filterValue,
            })),
            nextPageUrl: null,
            currentPage: 1,
            totalPages: 1,
          };
          initialLoadingState[node.id] = false;
        }
        else if (node.isDynamic && categoryKey && authToken) { // Fetch if dynamic and no initial data
          initialLoadingState[categoryKey] = true;
          try {
            let endpoint = `/common/${categoryKey}/`;
            if (categoryKey === "speciality_categories") {
              endpoint = `/facilities/${categoryKey}/`
            }
            if (categoryKey === "service_categories") {
              endpoint = `/facilities/service_categories/`
            }
            if (categoryKey === "facility_types") {
              endpoint = `/common/facility_types/`
            }
            if (categoryKey === "infrastructure") {
              endpoint = `/facilities/infrastructure_categories/`
            }

            const data = await fetchPaginatedFilterOptions(
              endpoint,
              authToken,
            );
            initialDynamicState[categoryKey] = {
              options: data.results.map((item) => ({
                id: item.id,
                text: item.name,
                filterKey: categoryKey,
                filterValue: item.id,
              })),
              nextPageUrl: data.next,
              currentPage: data.currentPage,
              totalPages: data.totalPages,
              pageSize: data.results.length,
            };
          } catch (error) {
            console.error(
              `Failed to fetch initial data for ${categoryKey}:`,
              error,
            );
            initialDynamicState[categoryKey] = {
              options: [],
              nextPageUrl: null,
              currentPage: 1,
              totalPages: 1,
            };
          } finally {
            initialLoadingState[categoryKey] = false;
          }
        } else { // Fallback for non-dynamic or no-auth dynamic nodes
          initialDynamicState[categoryKey] = {
            options: [],
            nextPageUrl: null,
            currentPage: 1,
            totalPages: 1,
          };
          initialLoadingState[categoryKey] = false;
        }
      }
      setDynamicFilterOptions(initialDynamicState);
      setLoadingMore(initialLoadingState);
    };

    initializeDynamicFilters();
  }, [filters, authToken]);

  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleCheckboxChange = useCallback(
    (childId, filterKey, filterValue, isLevel = false) => {
      setSelectedFilters((prev) => {
        const newFilters = { ...prev };

        if (isLevel) {
          // This logic seems specific to "grouping" level filters
          // Consider if these should be mutually exclusive more broadly
          newFilters.national = false;
          newFilters.county = false;
          newFilters["sub-county"] = false;
          newFilters.ward = false;
          newFilters[childId] = !prev[childId];
        } else {
          newFilters[childId] = !prev[childId];
        }

        return newFilters;
      });

      if (onFiltersChange) {
        const newFilters = {
          ...selectedFilters,
          [childId]: !selectedFilters[childId],
        };
        const filterObj = buildFilterObject(newFilters, {
          treeData: ANALYTICS_FILTER_TREE_DATA, // Use base tree data for consistent lookup
          dynamicFilterOptions,
          subCountiesByCounty,
          serviceDetails,
          specialityDetails,
          infrastructureDetails,
          facilityDetails,
          wardsBySubCounty,
          findNodeInTree,
        });
        onFiltersChange(newFilters, filterObj);
      }
    },
    [selectedFilters, onFiltersChange],
  );

  const handleLoadMore = useCallback(
    async (category) => {
      const currentCategoryState = dynamicFilterOptions[category];
      if (
        !currentCategoryState ||
        !currentCategoryState.nextPageUrl ||
        loadingMore[category]
      ) {
        return;
      }

      setLoadingMore((prev) => ({ ...prev, [category]: true }));

      try {
        const url = new URL(currentCategoryState.nextPageUrl);
        const endpoint = url.pathname.replace("/api", "");
        const page =
          url.searchParams.get("page") || currentCategoryState.currentPage + 1;

        const data = await fetchPaginatedFilterOptions(
          endpoint,
          authToken,
          page,
        );

        setDynamicFilterOptions((prev) => ({
          ...prev,
          [category]: {
            ...prev[category],
            options: [
              ...prev[category].options,
              ...data.results.map((item) => ({
                id: item.id,
                text: item.name,
                filterKey: category,
                filterValue: item.id,
              })),
            ],
            nextPageUrl: data.next,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            pageSize: data.results.length,
          },
        }));
      } catch (error) {
        console.error(`Error loading more for ${category}:`, error);
      } finally {
        setLoadingMore((prev) => ({ ...prev, [category]: false }));
      }
    },
    [dynamicFilterOptions, loadingMore, authToken],
  );

  const fetchSubCounties = useCallback(
    async (countyId, nextPageUrl = null) => {
      setLoadingChildren((prev) => ({ ...prev, [countyId]: true }));
      try {
        const data = await fetchSubCountiesApi(
          countyId,
          authToken,
          nextPageUrl,
        );

        setSubCountiesByCounty((prev) => ({
          ...prev,
          [countyId]: {
            options: [
              ...(prev[countyId]?.options || []),
              ...data.results.map((item) => ({
                id: item.id,
                text: item.name,
                filterKey: "sub_counties",
                filterValue: item.id,
                county: countyId,
              })),
            ],
            nextPageUrl: data.next,
            hasMore: !!data.next,
          },
        }));
      } catch (e) {
        console.error(`Error fetching sub-counties for county ${countyId}:`, e);
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [countyId]: false }));
      }
    },
    [authToken],
  );

  const fetchWards = useCallback(
    async (subCountyId, nextPageUrl = null) => {
      setLoadingChildren((prev) => ({ ...prev, [subCountyId]: true }));
      try {
        const data = await fetchWardsApi(subCountyId, authToken, nextPageUrl);

        setWardsBySubCounty((prev) => {
          const existingWards = prev[subCountyId]?.options || [];
          const newWards = data.results.map((item) => ({
            id: item.id,
            text: item.name,
            filterKey: "wards",
            filterValue: item.id,
            sub_county: subCountyId,
          }));

          return {
            ...prev,
            [subCountyId]: {
              options: [...existingWards, ...newWards],
              nextPageUrl: data.next,
              hasMore: !!data.next,
            },
          };
        });
      } catch (e) {
        console.error(`Error fetching wards for sub-county ${subCountyId}:`, e);
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [subCountyId]: false }));
      }
    },
    [authToken],
  );

  const fetchSpecialty = useCallback(
    async (categoryId, nextPageUrl = null) => {
      setLoadingChildren((prev) => ({ ...prev, [categoryId]: true }));
      try {
        const data = await fetchSpecialityDetailsApi(
          categoryId,
          authToken,
          nextPageUrl,
        );
        setSpecialityDetails((prev) => {
          const existingSpecialties = prev[categoryId]?.options || [];
          const newSpecialties = data.results.map((item) => ({
            id: item.id,
            text: item.name,
            filterKey: "speciality",
            filterValue: item.id,
          }));
          return {
            ...prev,
            [categoryId]: {
              options: [...existingSpecialties, ...newSpecialties],
              nextPageUrl: data.next,
              hasMore: !!data.next,
            },
          };
        });
      } catch (e) {
        console.error(
          `Error fetching specialty details for category ${categoryId}:`,
          e,
        );
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [categoryId]: false }));
      }
    },
    [authToken],
  );

  const fetchServiceCategoryDetails = useCallback(
    async (categoryId, nextPageUrl = null) => {
      setLoadingChildren((prev) => ({ ...prev, [categoryId]: true }));
      try {
        const data = await fetchServicesDetailsApi(
          categoryId,
          authToken,
          nextPageUrl,
        );

        setServiceDetails((prev) => {
          const existingServices = prev[categoryId]?.options || [];
          const newServices = data.results.map((item) => ({
            id: item.id,
            text: item.name,
            filterKey: "facility_types_details",
            filterValue: item.id,
          }));

          return {
            ...prev,
            [categoryId]: {
              options: [...existingServices, ...newServices],
              nextPageUrl: data.next,
              hasMore: !!data.next,
            },
          };
        });
      } catch (e) {
        console.error(
          `Error fetching service details; service_category_id: ${categoryId}:`,
          e,
        );
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [categoryId]: false }));
      }
    },
    [authToken],
  );

  const fetchInfrastructureCategoryDetails = useCallback(
    async (categoryId, nextPageUrl = null) => {
      setLoadingChildren((prev) => ({ ...prev, [categoryId]: true }));
      try {

        const data = await fetchInfrastructureDetailsApi(
          categoryId,
          authToken,
          nextPageUrl,
        );

        setInfrastructureDetails((prev) => {
          const existingInfrastructure = prev[categoryId]?.options || [];
          const newInfrastructure = data.results.map((item) => ({
            id: item.id,
            text: item.name,
            filterKey: "infrastructure",
            filterValue: item.id,
          }));
          return {
            ...prev,
            [categoryId]: {
              options: [...existingInfrastructure, ...newInfrastructure],
              nextPageUrl: data.next,
              hasMore: !!data.next,
            },
          };
        });
      } catch (e) {
        console.error(
          `Error fetching infrastructure details for category ${categoryId}:`,
          e,
        );
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [categoryId]: false }));
      }
    },
    [authToken],
  );

  // Renamed the local function to better reflect its new origin
  const handleFetchFacilityTypeDetails = useCallback(
    async (facilityTypeId, nextPageUrl = null) => {
      setLoadingChildren((prev) => ({ ...prev, [facilityTypeId]: true }));
      try {
        const data = await fetchFacilityTypeDetailsApi(
          facilityTypeId,
          authToken,
          nextPageUrl,
        );

        setFacilityDetails((prev) => {
          const existingDetails = prev[facilityTypeId]?.options || [];
          const newDetails = data.results.map((item) => ({
            id: item.id,
            text: item.name,
            filterKey: "facility_details",
            filterValue: item.id,
          }));
          return {
            ...prev,
            [facilityTypeId]: {
              options: [...existingDetails, ...newDetails],
              nextPageUrl: data.next,
              hasMore: !!data.next,
            },
          };
        });
      } catch (e) {
        console.error(
          `Error fetching facility details for facility type ${facilityTypeId}:`,
          e,
        );
      } finally {
        setLoadingChildren((prev) => ({ ...prev, [facilityTypeId]: false }));
      }
    },
    [authToken],
  );


  const buildCountyTree = useCallback(() => {
    const counties =
      dynamicFilterOptions.counties?.options ||
      filters.counties?.results?.map((item) => ({
        id: item.id,
        text: item.name,
        filterKey: "counties",
        filterValue: item.id,
      })) || [];
    return counties.map((county) => ({
      ...county,
      children: subCountiesByCounty[county.id]?.options || [],
      hasMore: !!subCountiesByCounty[county.id]?.nextPageUrl,
      isLoading: !!loadingChildren[county.id],
    }));
  }, [filters.counties, subCountiesByCounty, loadingChildren, dynamicFilterOptions.counties]);

  const buildSubCountyChildren = useCallback(
    (subCounty) => ({
      ...subCounty,
      children: wardsBySubCounty[subCounty.id]?.options || [],
      hasMore: !!wardsBySubCounty[subCounty.id]?.nextPageUrl,
      isLoading: !!loadingChildren[subCounty.id],
    }),
    [wardsBySubCounty, loadingChildren],
  );

  const treeData = useMemo(() => {
    // Start with the base configuration from analyticsFilterConfig
    return ANALYTICS_FILTER_TREE_DATA.map((node) => {
      if (node.id === "counties") {
        return {
          ...node,
          children: buildCountyTree(),
        };
      }
      // "sub_counties" and "wards" are populated as children of "counties" and "sub-counties" respectively,
      if (["sub_counties", "wards"].includes(node.id)) {
        return null;
      }

      // Handle nested dynamic categories (Speciality, Services, Infrastructure, Facility Types)
      if (
        node.id === "speciality_categories" ||
        node.id === "facilities" ||
        node.id === "infrastructure" ||
        node.id === "service_categories"
      ) {
        const categories =
          dynamicFilterOptions[node.filterCategory]?.options || [];
        return {
          ...node,
          children: categories.map((cat) => {
            let details = [];
            let hasMoreDetails = false;
            let isLoadingDetails = false;
            let detailFilterKey = "";

            if (node.id === "speciality_categories") {
              details = specialityDetails[cat.id]?.options || [];
              hasMoreDetails = !!specialityDetails[cat.id]?.nextPageUrl;
              isLoadingDetails = !!loadingChildren[cat.id];
              detailFilterKey = "speciality";
            } else if (node.id === "facilities") {
              details = facilityDetails[cat.id]?.options || [];
              hasMoreDetails = !!facilityDetails[cat.id]?.nextPageUrl;
              isLoadingDetails = !!loadingChildren[cat.id];
              detailFilterKey = "facility_details";
            } else if (node.id === "infrastructure") {
              details = infrastructureDetails[cat.id]?.options || [];
              hasMoreDetails = !!infrastructureDetails[cat.id]?.nextPageUrl;
              isLoadingDetails = !!loadingChildren[cat.id];
              detailFilterKey = "infrastructure";
            } else if (node.id === "service_categories") {
              details = serviceDetails[cat.id]?.options || [];
              hasMoreDetails = !!serviceDetails[cat.id]?.nextPageUrl;
              isLoadingDetails = !!loadingChildren[cat.id];
              detailFilterKey = "service_types_details";
            }

            return {
              ...cat,
              children: details,
              hasMore: hasMoreDetails,
              isLoading: isLoadingDetails,
              filterKey: detailFilterKey,
            };
          }),
          hasMore: dynamicFilterOptions[node.filterCategory]?.nextPageUrl
            ? true
            : false,
          isLoading: loadingMore[node.filterCategory] || false,
        };
      }

      // For other dynamic categories (ownership, regulatory_bodies, status, keph_level)
      const dynamicChildren =
        dynamicFilterOptions[node.filterCategory]?.options || [];
      return {
        ...node,
        children:
          dynamicChildren.length > 0 ? dynamicChildren : node.children || [],
        hasMore: dynamicFilterOptions[node.filterCategory]?.nextPageUrl
          ? true
          : false,
        isLoading: loadingMore[node.filterCategory] || false,
      };
    }).filter(Boolean); // Filter out nulls from sub_counties and wards
  }, [
    dynamicFilterOptions,
    buildCountyTree,
    loadingMore,
    serviceDetails,
    specialityDetails,
    infrastructureDetails,
    facilityDetails,
    loadingChildren,
  ]);

  const filteredTreeData = useMemo(() => {
    if (!searchTerm.trim()) return treeData;
    const lower = searchTerm.toLowerCase();
    return treeData
      .map((node) => {
        const nodeMatches = node.text.toLowerCase().includes(lower);
        const filteredChildren = (node.children || []).filter((child) =>
          child.text.toLowerCase().includes(lower),
        );
        if (nodeMatches || filteredChildren.length > 0) {
          return {
            ...node,
            children: nodeMatches ? node.children : filteredChildren,
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [treeData, searchTerm]);

  const getAllDescendantIds = useCallback((node) => {
    let ids = [node.id];
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        ids = ids.concat(getAllDescendantIds(child));
      });
    }
    return ids;
  }, []);

  const areAllChildrenSelected = useCallback((node, selectedFilters) => {
    if (!node.children || node.children.length === 0)
      return !!selectedFilters[node.id];
    return node.children.every((child) =>
      areAllChildrenSelected(child, selectedFilters),
    );
  }, []);

  const areSomeChildrenSelected = useCallback((node, selectedFilters) => {
    if (!node.children || node.children.length === 0)
      return !!selectedFilters[node.id];
    return node.children.some((child) =>
      areSomeChildrenSelected(child, selectedFilters),
    );
  }, []);

  const flattenTree = useCallback((nodes) => {
    let result = [];
    for (const node of nodes) {
      result.push(node);
      if (node.children) {
        result = result.concat(flattenTree(node.children));
      }
    }
    return result;
  }, []);

  const findNodeInTree = useCallback((id, nodes) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeInTree(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const getAllNodes = useCallback(() => {
    const allNodes = [];
    const traverse = (nodes) => {
      nodes.forEach((node) => {
        allNodes.push(node);
        if (node.children) traverse(node.children);
      });
    };
    traverse(treeData);
    return allNodes;
  }, [treeData]);

  const renderTreeChildren = useCallback(
    (children, parentNodeId) => {
      if (!children) return null;
      return (
        <ul className="ml-4 border-l border-gray-200">
          {children.map((child, idx) => {
            const allSelected = areAllChildrenSelected(child, selectedFilters);
            const someSelected = areSomeChildrenSelected(
              child,
              selectedFilters,
            );
            const isCounty = child.filterKey === "counties";
            const isSubCounty = child.filterKey === "sub_counties";
            const isServicesCategory = parentNodeId === "service_categories";
            const isSpecialty = parentNodeId === "speciality_categories";
            const isInfrastructureCategory = parentNodeId === "infrastructure";
            const isFacilityType = parentNodeId === "facilities";
            const isLast = idx === children.length - 1;

            return (
              <React.Fragment key={child.id}>
                <li className="py-1">
                  <div className="flex items-center group">
                    {(child.children && child.children.length > 0) ||
                      isCounty ||
                      isServicesCategory ||
                      isSpecialty ||
                      isInfrastructureCategory ||
                      isFacilityType ||
                      isSubCounty ? (
                      <button
                        type="button"
                        className="mr-1 focus:outline-none"
                        onClick={async () => {
                          setExpandedNodes((prev) => ({
                            ...prev,
                            [child.id]: !prev[child.id],
                          }));
                          if (!expandedNodes[child.id]) {
                            if (
                              isCounty &&
                              !subCountiesByCounty[child.id]?.options?.length
                            ) {
                              await fetchSubCounties(child.id);
                            }
                            if (
                              isSubCounty &&
                              !wardsBySubCounty[child.id]?.options?.length
                            ) {
                              await fetchWards(child.id);
                            }
                            if (
                              isSpecialty &&
                              !specialityDetails[child.id]?.options?.length
                            ) {
                              await fetchSpecialty(child.id);
                            }
                            if (
                              isServicesCategory &&
                              !serviceDetails[child.id]?.options?.length
                            ) {
                              await fetchServiceCategoryDetails(child.id);
                            }
                            if (
                              isInfrastructureCategory &&
                              !infrastructureDetails[child.id]?.options?.length
                            ) {
                              await fetchInfrastructureCategoryDetails(child.id);
                            }
                            if (
                              isFacilityType &&
                              !facilityDetails[child.id]?.options?.length
                            ) {
                              await handleFetchFacilityTypeDetails(child.id);
                            }
                          }
                        }}
                        aria-label={
                          expandedNodes[child.id] ? "Collapse" : "Expand"
                        }
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
                      ref={(el) => {
                        if (el) el.indeterminate = !allSelected && someSelected;
                      }}
                      onChange={() => {
                        const descendantIds = getAllDescendantIds(child);
                        const newFilters = { ...selectedFilters };
                        const shouldCheck = !allSelected;
                        descendantIds.forEach((id) => {
                          newFilters[id] = shouldCheck;
                        });
                        setSelectedFilters(newFilters);
                        if (onFiltersChange) {
                          const filterObj = buildFilterObject(newFilters, {
                            treeData: ANALYTICS_FILTER_TREE_DATA,
                            dynamicFilterOptions,
                            subCountiesByCounty,
                            serviceDetails,
                            specialityDetails,
                            infrastructureDetails,
                            facilityDetails,
                            wardsBySubCounty,
                            findNodeInTree,
                          });
                          onFiltersChange(newFilters, filterObj);
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

                  {expandedNodes[child.id] && (
                    <>
                      {child.isLoading && (
                        <div className="text-xs text-gray-400 ml-6">
                          Loading...
                        </div>
                      )}
                      {isSubCounty
                        ? renderTreeChildren(
                          buildSubCountyChildren(child).children,
                          child.id,
                        )
                        : renderTreeChildren(child.children, child.id)}
                    </>
                  )}
                </li>
                {/* Load more for sub-counties */}
                {isCounty &&
                  isLast &&
                  subCountiesByCounty[child.id]?.hasMore && (
                    <li>
                      <button
                        className="ml-8 text-xs text-blue-600 hover:underline"
                        onClick={() =>
                          fetchSubCounties(
                            child.id,
                            subCountiesByCounty[child.id].nextPageUrl,
                          )
                        }
                        disabled={subCountiesByCounty[child.id]?.isLoading}
                      >
                        {subCountiesByCounty[child.id]?.isLoading
                          ? "Loading..."
                          : "Load more sub-counties"}
                      </button>
                    </li>
                  )}
                {/* Load more for wards */}
                {isSubCounty &&
                  isLast &&
                  wardsBySubCounty[child.id]?.hasMore && (
                    <li>
                      <button
                        className="ml-8 text-xs text-blue-600 hover:underline"
                        onClick={() =>
                          fetchWards(
                            child.id,
                            wardsBySubCounty[child.id].nextPageUrl,
                          )
                        }
                        disabled={wardsBySubCounty[child.id]?.isLoading}
                      >
                        {wardsBySubCounty[child.id]?.isLoading
                          ? "Loading..."
                          : "Load more wards"}
                      </button>
                    </li>
                  )}
                {/* Load more for infrastructure details */}
                {isInfrastructureCategory &&
                  isLast &&
                  infrastructureDetails[child.id]?.hasMore && (
                    <li>
                      <button
                        className="ml-8 text-xs text-blue-600 hover:underline"
                        onClick={() =>
                          fetchInfrastructureCategoryDetails(
                            child.id,
                            infrastructureDetails[child.id].nextPageUrl,
                          )
                        }
                        disabled={infrastructureDetails[child.id]?.isLoading}
                      >
                        {infrastructureDetails[child.id]?.isLoading
                          ? "Loading..."
                          : "Load more infrastructure details"}
                      </button>
                    </li>
                  )}
                {/* Load more for facility details */}
                {isFacilityType &&
                  isLast &&
                  facilityDetails[child.id]?.hasMore && (
                    <li>
                      <button
                        className="ml-8 text-xs text-blue-600 hover:underline"
                        onClick={() =>
                          handleFetchFacilityTypeDetails(
                            child.id,
                            facilityDetails[child.id].nextPageUrl,
                          )
                        }
                        disabled={facilityDetails[child.id]?.isLoading}
                      >
                        {facilityDetails[child.id]?.isLoading
                          ? "Loading..."
                          : "Load more facility details"}
                      </button>
                    </li>
                  )}
                 {/* Load more for speciality details */}
                 {isSpecialty &&
                  isLast &&
                  specialityDetails[child.id]?.hasMore && (
                    <li>
                      <button
                        className="ml-8 text-xs text-blue-600 hover:underline"
                        onClick={() =>
                          fetchSpecialty(
                            child.id,
                            specialityDetails[child.id].nextPageUrl,
                          )
                        }
                        disabled={specialityDetails[child.id]?.isLoading}
                      >
                        {specialityDetails[child.id]?.isLoading
                          ? "Loading..."
                          : "Load more speciality details"}
                      </button>
                    </li>
                  )}
                {/* Load more for service details */}
                {isServicesCategory &&
                  isLast &&
                  serviceDetails[child.id]?.hasMore && (
                    <li>
                      <button
                        className="ml-8 text-xs text-blue-600 hover:underline"
                        onClick={() =>
                          fetchServiceCategoryDetails(
                            child.id,
                            serviceDetails[child.id].nextPageUrl,
                          )
                        }
                        disabled={serviceDetails[child.id]?.isLoading}
                      >
                        {serviceDetails[child.id]?.isLoading
                          ? "Loading..."
                          : "Load more service details"}
                      </button>
                    </li>
                  )}

              </React.Fragment>
            );
          })}
        </ul>
      );
    },
    [
      expandedNodes,
      selectedFilters,
      subCountiesByCounty,
      wardsBySubCounty,
      loadingChildren,
      fetchSubCounties,
      fetchWards,
      fetchServiceCategoryDetails,
      fetchSpecialty,
      fetchInfrastructureCategoryDetails,
      handleFetchFacilityTypeDetails,
      specialityDetails,
      serviceDetails,
      infrastructureDetails,
      facilityDetails,
      areAllChildrenSelected,
      areSomeChildrenSelected,
      getAllDescendantIds,
      onFiltersChange,
      buildSubCountyChildren,
    ],
  );

  return (
    <div className="w-full bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-4">Analytics Filters</h3>
      <div className="mb-3 relative">
        <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          placeholder="Search filters..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            const lowerCaseTerm = e.target.value.toLowerCase();
            const allNodes = getAllNodes();
            const results = allNodes.filter(
              (node) =>
                node.text && node.text.toLowerCase().includes(lowerCaseTerm),
            );
            setSearchResults(results);
          }}
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && searchResults.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <li
                key={result.id}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  const newFilters = { ...selectedFilters };
                  newFilters[result.id] = !newFilters[result.id];
                  setSelectedFilters(newFilters);
                  if (onFiltersChange) {
                    const filterObj = buildFilterObject(newFilters, {
                      treeData: ANALYTICS_FILTER_TREE_DATA,
                      dynamicFilterOptions,
                      subCountiesByCounty,
                      wardsBySubCounty,
                      serviceDetails,
                      specialityDetails,
                      infrastructureDetails,
                      facilityDetails,
                      findNodeInTree,
                    });
                    onFiltersChange(newFilters, filterObj);
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
          <div className="text-gray-500 text-sm px-2 py-4">
            No filters found.
          </div>
        ) : (
          <ul>
            {filteredTreeData.map((node) => {
              const allSelected = areAllChildrenSelected(node, selectedFilters);
              const someSelected = areSomeChildrenSelected(
                node,
                selectedFilters,
              );
              const hasChildren = node.children && node.children.length > 0;
              const isLoading = node.isLoading;
              const hasMore = node.hasMore;

              return (
                <li key={node.id} className="mb-1">
                  <div className="flex items-center group">
                    {hasChildren && (
                      <button
                        type="button"
                        className="mr-1 focus:outline-none"
                        onClick={() => toggleNode(node.id)}
                        aria-label={
                          expandedNodes[node.id] ? "Collapse" : "Expand"
                        }
                      >
                        {expandedNodes[node.id] ? (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    )}
                    {!hasChildren && <span className="w-5 h-5 mr-1" />}
                    <input
                      type="checkbox"
                      id={node.id}
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = !allSelected && someSelected;
                      }}
                      onChange={() => {
                        const descendantIds = getAllDescendantIds(node);
                        const newFilters = { ...selectedFilters };
                        const shouldCheck = !allSelected;
                        descendantIds.forEach((id) => {
                          newFilters[id] = shouldCheck;
                        });
                        setSelectedFilters(newFilters);
                        if (onFiltersChange) {
                          const filterObj = buildFilterObject(newFilters, {
                            treeData: ANALYTICS_FILTER_TREE_DATA,
                            dynamicFilterOptions,
                            subCountiesByCounty,
                            serviceDetails,
                            specialityDetails,
                            infrastructureDetails,
                            facilityDetails,
                            wardsBySubCounty,
                            findNodeInTree,
                          });
                          onFiltersChange(newFilters, filterObj);
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
                  {hasChildren && expandedNodes[node.id] && (
                    <>
                      {isLoading && (
                        <div className="text-xs text-gray-400 ml-6">
                          Loading...
                        </div>
                      )}
                      {renderTreeChildren(node.children, node.id)}
                      {hasMore && !isLoading && node.id !== "counties" && (
                        <button
                          className="ml-8 text-xs text-blue-600 hover:underline"
                          onClick={() => handleLoadMore(node.filterCategory)}
                          disabled={loadingMore[node.filterCategory]}
                        >
                          {loadingMore[node.filterCategory]
                            ? "Loading..."
                            : "Load more"}
                        </button>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

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
                const filter = getFilterMetaById(filterId, {
                  treeData: ANALYTICS_FILTER_TREE_DATA,
                  dynamicFilterOptions,
                  subCountiesByCounty,
                  serviceDetails,
                  specialityDetails,
                  infrastructureDetails,
                  facilityDetails,
                  wardsBySubCounty,
                  findNodeInTree,
                });

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
          className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          onClick={() => {
            setSelectedFilters(
              Object.fromEntries(
                Object.keys(selectedFilters).map((k) => [k, false]),
              ),
            );
            setSearchTerm("");
            // Reset expanded nodes, based on ANALYTICS_FILTER_TREE_DATA structure
            setExpandedNodes({});

            if (onFiltersChange) {
              const clearedFilters = Object.fromEntries(
                Object.keys(selectedFilters).map((k) => [k, false]),
              );
              const filterObj = buildFilterObject(clearedFilters, {
                treeData: ANALYTICS_FILTER_TREE_DATA,
                dynamicFilterOptions,
                subCountiesByCounty,
                serviceDetails,
                specialityDetails,
                infrastructureDetails,
                facilityDetails,
                wardsBySubCounty,
                findNodeInTree,
              });
              onFiltersChange(clearedFilters, filterObj, { resetTable: true });
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