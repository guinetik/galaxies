# Database Page Design

## Overview

A new `/database` route that exposes the galaxies.db SQLite database as an interactive query tool. Postman-inspired layout: a query bar on top, collapsible sidebar for building queries visually, and a results data table below.

## Layout

### 1. Query Bar (top, always visible)

- Full-width textarea displaying the current SQL query
- **Edit toggle** above the textarea: when OFF (default), query is read-only and auto-generated from sidebar state. When ON, query is editable free-text and sidebar is disabled
- **Run button** to the right of the textarea — executes the query
- Error messages displayed inline below the query bar when a query fails

### 2. Collapsible Sidebar (left)

Collapsed/expanded via a toggle button. When the Edit toggle is ON, the sidebar is visually disabled (grayed out). Sections:

#### Filters
- Add filter rows: column dropdown, operator dropdown (=, !=, >, <, >=, <=, LIKE, IS NULL, IS NOT NULL), value input
- Multiple filters combined with AND
- Column dropdown grouped by category:
  - **Identifiers**: pgc, name, agc, source
  - **Coordinates**: ra, dec, glon, glat, sgl, sgb
  - **Distances**: vcmb, dm, distance_mpc, distance_mly
  - **Distance Methods**: dm_snia, dm_tf, dm_fp, dm_sbf, dm_snii, dm_trgb, dm_ceph, dm_mas (+ error columns)
  - **Physical Properties**: morphology, b_mag, diameter_arcsec, axial_ratio, position_angle, ba, t17
  - **HI & Star Formation**: log_mhi, log_ms_t, log_sfr_nuv, v_hi (+ error columns)

#### Columns
- Checkboxes to select which columns appear in the SELECT clause
- "Select All" / "Clear" toggles
- Default selection: pgc, name, ra, dec, morphology, distance_mly, source

#### Order By
- Column dropdown + ASC/DESC toggle
- Default: pgc ASC

#### Limit
- Number input, default 100, max 1000

#### Sample Queries
Clickable presets that populate the sidebar state (filters, columns, order, limit):

| Label | Description |
|-------|-------------|
| Nearest galaxies | ORDER BY distance_mly ASC, LIMIT 50 |
| Spiral galaxies | morphology = 'spiral', LIMIT 100 |
| ALFALFA HI-rich | source = 'ALFALFA', ORDER BY log_mhi DESC, LIMIT 100 |
| Cepheid distances | dm_ceph IS NOT NULL, LIMIT 100 |
| Brightest galaxies | ORDER BY b_mag ASC, LIMIT 100 |

### 3. Results Table (below query bar, main area)

- Responsive data table with the columns from the query result
- **PGC column** rendered as a link to `/g/:pgc` (the galaxy detail page)
- **Name column** also links to `/g/:pgc` when PGC is available in the result set
- Row count header: "Showing X results" (or "Showing X of Y" when limited)
- Sortable column headers — clicking a header re-sorts and re-runs the query
- Empty state: "Run a query to see results"
- Loading state: spinner during query execution

## Behavior

### Query Building (Edit toggle OFF)
1. User interacts with sidebar (filters, columns, ordering, limit)
2. Sidebar state is reactively compiled into a SQL SELECT statement
3. Query bar textarea updates live with the generated SQL (read-only)
4. User clicks Run to execute

### Free-form Mode (Edit toggle ON)
1. Toggle switches to ON — textarea becomes editable
2. Sidebar is visually disabled (grayed out, inputs non-interactive)
3. User writes or edits SQL freely in the textarea
4. User clicks Run to execute
5. Toggle OFF → sidebar re-takes control, overwrites manual edits with generated SQL

### Safety & Validation
- Only SELECT statements allowed — reject anything else with an error message
- LIMIT enforced: if user omits LIMIT or exceeds 1000, append/cap at 1000
- All queries run against the in-browser sql.js instance (no server, no network)
- Query execution errors shown inline below the query bar
- No SQL injection risk (local read-only SQLite), but non-SELECT rejection provides clear UX

### Query Targets
- Default table: `galaxies`
- Also queryable: `galaxy_groups`
- JOINs between the two tables supported in free-form mode

## Components

### DatabaseView.vue
Main view component. Manages:
- Sidebar open/close state
- Edit toggle state
- Query string (reactive)
- Query results (reactive)
- Error state

### DatabaseSidebar.vue
Sidebar component with filter/column/order/limit/preset sections. Emits the sidebar state to the parent, which compiles it into SQL.

### DatabaseResultsTable.vue
Results table component. Receives column definitions and row data as props. Handles:
- Rendering PGC/name as links
- Column header click → emit sort event
- Empty/loading/error states

## Query Compilation

The sidebar state compiles to SQL following this template:

```sql
SELECT {columns}
FROM galaxies
WHERE {filter1} AND {filter2} AND ...
ORDER BY {column} {ASC|DESC}
LIMIT {n}
```

Column values are parameterized where possible. For IS NULL / IS NOT NULL operators, no value input is shown.

## Route

- Path: `/database`
- Name: `database`
- Component: lazy-loaded `DatabaseView.vue`
- Added to nav in AppHeader

## i18n

Add `pages.database` section to both `en-US.json` and `pt-BR.json` with keys for:
- Page title, description
- Sidebar section labels
- Filter operators
- Sample query labels/descriptions
- Results table states (empty, loading, error, row count)
- Edit toggle label
- Run button label

## Styling

- Dark theme consistent with the rest of the site
- Tailwind utility classes + scoped CSS
- Sidebar: dark panel with subtle border, scrollable if content overflows
- Query bar: monospace font, dark background, subtle border
- Results table: striped rows, hover highlight, monospace for numeric values
- PGC/name links styled with accent color

## Non-goals (future sessions)

- Data science features (charts, histograms, aggregation visualization)
- Export to CSV/JSON
- Query history / saved queries
- Galaxy groups dedicated query mode
