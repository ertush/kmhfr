export const ANALYTICS_FILTER_TREE_DATA = [
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
    id: "counties",
    text: "Counties",
    children: [], // Will be populated dynamically from filters.county
    filterKey: "counties",
    isDynamic: true,
  },
  {
    id: "facilities",
    text: "Facilities Types",
    children: [], // Will be populated dynamically from filters.facility_type
    filterKey: "facility_types",
    isDynamic: true,
  },
  {
    id: "ownership",
    text: "By Ownership",
    children: [], // Will be populated dynamically from filters.owner_type
    filterKey: "owners",
    isDynamic: true,
  },
  {
    id: "regulatory_bodies",
    text: "Regulatory Bodies",
    children: [], // Will be populated dynamically from filters.regulatory_body
    filterKey: "regulatory_bodies",
    isDynamic: true,
  },
  {
    id: "infrastructure_categories",
    text: "Infrastructure Categories",
    children: [], // Will be populated dynamically from filters.infrastructure_category
    filterKey: "infrastructure_categories",
    isDynamic: true,
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
    id: "status",
    text: "By Operation Status",
    children: [], // Will be populated dynamically from filters.operation_status
    filterKey: "operation_status",
    isDynamic: true,
  },
  {
    id: "keph_level",
    text: "By KEPH Level",
    children: [], // Will be populated dynamically from filters.keph_level
    filterKey: "keph_levels",
    isDynamic: true,
  },
];

// Function to create dynamic filter options from API data
export const createDynamicFilterOptions = (filterData, filterKey) => {
  if (!filterData || !Array.isArray(filterData)) return [];
  
  return filterData.map(item => ({
    id: `${filterKey}-${item.id}`,
    text: item.name,
    filterKey: filterKey,
    filterValue: item.id,
    originalId: item.id,
  }));
};

// Function to populate tree data with dynamic filters
export const populateTreeDataWithFilters = (filters) => {
  if (!filters) return ANALYTICS_FILTER_TREE_DATA;

  return ANALYTICS_FILTER_TREE_DATA.map(node => {
    if (!node.isDynamic) return node;

    let children = [];
    switch (node.id) {
      case 'counties':
        children = createDynamicFilterOptions(filters.county, 'counties');
        break;
      case 'facilities':
        children = createDynamicFilterOptions(filters.facility_type, 'facility_types');
        break;
      case 'ownership':
        children = createDynamicFilterOptions(filters.owner_type, 'owners');
        break;
      case 'regulatory_bodies':
        children = createDynamicFilterOptions(filters.regulatory_body, 'regulatory_bodies');
        break;
      case 'infrastructure_categories':
        children = createDynamicFilterOptions(filters.infrastructure_category, 'infrastructure_categories');
        break;
      case 'status':
        children = createDynamicFilterOptions(filters.operation_status, 'operation_status');
        break;
      case 'keph_level':
        children = createDynamicFilterOptions(filters.keph_level, 'keph_levels');
        break;
      default:
        children = [];
    }

    return {
      ...node,
      children,
    };
  });
};

// Function to create initial selected filters state based on dynamic data
export const createInitialSelectedFilters = (filters) => {
  const initialFilters = {
    // Level filters (static)
    national: false,
    county: false,
    "sub-county": false,
    ward: false,
    // Services Analysis (static)
    "by-service-category": false,
    "by-service-availability": false,
  };

  if (!filters) return initialFilters;

  // Add dynamic filter options
  const filterTypes = [
    { key: 'county', prefix: 'counties' },
    { key: 'facility_type', prefix: 'facility_types' },
    { key: 'owner_type', prefix: 'owners' },
    { key: 'regulatory_body', prefix: 'regulatory_bodies' },
    { key: 'infrastructure_category', prefix: 'infrastructure_categories' },
    { key: 'operation_status', prefix: 'operation_status' },
    { key: 'keph_level', prefix: 'keph_levels' },
  ];

  filterTypes.forEach(({ key, prefix }) => {
    if (filters[key] && Array.isArray(filters[key])) {
      filters[key].forEach(item => {
        initialFilters[`${prefix}-${item.id}`] = false;
      });
    }
  });

  return initialFilters;
};
