export const ANALYTICS_FILTER_TREE_DATA = [
  {
    id: "grouping",
    text: "Grouping",
    children: [
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
    id: "counties",
    text: "Counties",
    children: [], 
    filterCategory: "counties",
    isDynamic: true,
  },
  {
    id: "facilities",
    text: "Facility Types",
    children: [],
    filterCategory: "facility_types",
  },
  {
    id: "ownership",
    text: "By Ownership",
    children: [],
    filterCategory: "owner_types",
    isDynamic: true,
  },
  {
    id: "regulatory_bodies",
    text: "Regulatory Bodies",
    children: [],
    filterCategory: "regulating_bodies",
    isDynamic: true,
  },
  {
    id: "service_categories",
    text: "Services Categories",
    children: [],
    filterCategory: "service_categories",
    isDynamic: true,
  },
  {
    id: "status",
    text: "By Operation Status",
    children: [], 
    filterCategory: "facility_status",
    isDynamic: true,
  },
  {
    id: "keph_level",
    text: "KEPH Level",
    children: [],
    filterCategory: "keph_level",
    isDynamic: true,
  },
  {
    id: "sub_counties",
    text: "Sub Counties",
    children: [],
    filterCategory: "sub_counties",
    isDynamic: true,
  },
  {
    id: "wards",
    text: "Wards",
    children: [],
    filterCategory: "wards",
    isDynamic: true,
  },
  {
    id: "facility_details",
    text: "Facility Details",
    children: [],
    filterCategory: "facility_details",
    isDynamic: true,
  },
  { 
    id: "infrastructure_categories",
    text: "Infrastructure Categories",
    children: [],
    filterCategory: "infrastructure_categories",
    isDynamic: true,
  }, 
  {
    id: "specialty_category",
    text: "Human Resource ",
    children: [],
    filterCategory: "specialty_category",
    isDynamic: true,
  },
];

export const createDynamicFilterOptions = (filterData, filterKey) => {
  if (!filterData || !Array.isArray(filterData)) return [];
  
  return filterData.map(item => ({
    id: item.id,
    text: item.name,
    filterKey: filterKey,
    filterValue: item.id,
  }));
};

export const populateTreeDataWithFilters = (filters) => {
  if (!filters) return ANALYTICS_FILTER_TREE_DATA;

  return ANALYTICS_FILTER_TREE_DATA.map(node => {
    if (!node.isDynamic) return node;

    let children = [];
    const categoryData = filters[node.filterCategory];


    if (categoryData && categoryData.results && Array.isArray(categoryData.results)) {
      children = createDynamicFilterOptions(categoryData.results, node.filterCategory);
    } else if (categoryData && Array.isArray(categoryData)) {
      children = createDynamicFilterOptions(categoryData, node.filterCategory);
    }

    return {
      ...node,
      children,
    };
  });
};

export const createInitialSelectedFilters = (filters) => {
  const initialFilters = {
    national: false,
    county: false,
    "sub-county": false,
    ward: false,
    "by-service-category": false,
    "by-service-availability": false,
  };

  if (!filters) return initialFilters;

  const filterCategories = [
    'counties', 'facility_types', 'owner_types', 'regulating_bodies',
    'service_categories', 'facility_status', 'keph_level', 'sub_counties', 'wards'
  ];

  filterCategories.forEach(categoryKey => {
    const categoryResults = filters[categoryKey]?.results;
    if (categoryResults && Array.isArray(categoryResults)) {
      categoryResults.forEach(item => {
        initialFilters[item.id] = false; 
      });
    }
  });

  return initialFilters;
};