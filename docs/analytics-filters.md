# Dynamic Analytics Filters Documentation

## Overview
The analytics page now features a fully dynamic filtering system that automatically populates filter options from the API and generates dynamic filter queries based on user selections.

## How It Works

### 1. Filter Configuration (`utils/analyticsFilterConfig.js`)

The filter configuration supports both static and dynamic filters:

- **Static Filters**: Level selection (national, county, sub-county, ward) and services analysis
- **Dynamic Filters**: Counties, facility types, ownership, regulatory bodies, infrastructure categories, operation status, and KEPH levels

Dynamic filters are marked with `isDynamic: true` and have empty children arrays that get populated at runtime.

### 2. Dynamic Population

The `populateTreeDataWithFilters(filters)` function:
- Takes the raw filters data from the API
- Dynamically creates filter options with proper IDs and names
- Maps API filter categories to UI filter categories

### 3. Filter Transformation

The `transformFiltersToAPIBody(selectedFilters)` function:
- Takes the current selected filters state
- Extracts the actual IDs from the dynamic filter names
- Builds the proper API request body structure

### 4. API Request Structure

The system generates API requests in this format:
```javascript
{
  col_dims: "bed_types",
  report_type: "matrix_report", 
  metric: "number_of_facilities",
  row_comparison: "county", // Dynamic based on level selection
  filters: {
    counties: ["id1", "id2", ...],
    facility_types: ["id1", "id2", ...],
    owners: ["id1", "id2", ...],
    regulatory_bodies: ["id1", "id2", ...],
    infrastructure_categories: ["id1", "id2", ...],
    operation_status: ["id1", "id2", ...],
    keph_levels: ["id1", "id2", ...]
  }
}
```

## Filter Mapping

| UI Filter Category | API Filter Key | Source Data |
|-------------------|----------------|-------------|
| Counties | `counties` | `filters.county` |
| Facilities Types | `facility_types` | `filters.facility_type` |
| By Ownership | `owners` | `filters.owner_type` |
| Regulatory Bodies | `regulatory_bodies` | `filters.regulatory_body` |
| Infrastructure Categories | `infrastructure_categories` | `filters.infrastructure_category` |
| By Operation Status | `operation_status` | `filters.operation_status` |
| By KEPH Level | `keph_levels` | `filters.keph_level` |

## Features

### Real-time Filtering
- Filters update analytics data immediately when changed
- 500ms debounce prevents excessive API calls
- Loading states provide user feedback

### Filter State Management
- Tracks applied filters count
- Reset functionality to clear all filters
- Persistent filter state during session

### Development Tools
- Debug button (development mode only)
- Console logging of API requests/responses
- Filter state inspection

### User Experience
- Expandable filter categories
- Visual feedback for applied filters
- Loading indicators
- Error handling with detailed logging

## Usage

### For Users
1. Select filters from the sidebar
2. Watch as analytics data updates automatically
3. Use "Reset Filters" to return to default view
4. Filter count badge shows how many filters are active

### For Developers
1. Use "Debug Filters" button to inspect current state
2. Check browser console for API request/response details
3. Filter state and API body are logged for debugging

## Adding New Filter Categories

To add a new dynamic filter category:

1. Add to `ANALYTICS_FILTER_TREE_DATA` in `analyticsFilterConfig.js`:
```javascript
{
  id: "new_category",
  text: "New Category",
  children: [],
  filterKey: "new_category_api_key",
  isDynamic: true,
}
```

2. Add to `populateTreeDataWithFilters()` switch statement:
```javascript
case 'new_category':
  children = createDynamicFilterOptions(filters.new_category_source, 'new_category_api_key');
  break;
```

3. Add to `createInitialSelectedFilters()` filterTypes array:
```javascript
{ key: 'new_category_source', prefix: 'new_category_api_key' }
```

4. Add to `transformFiltersToAPIBody()`:
```javascript
const newCategory = extractFilterIds("new_category_api_key");
if (newCategory.length > 0) {
  body.filters.new_category_api_key = newCategory;
}
```

## Performance Considerations

- Filter changes are debounced (500ms) to reduce API calls
- Initial data is loaded server-side for faster first load
- Dynamic filter options are memoized to prevent unnecessary re-renders
- Loading states prevent multiple simultaneous requests
