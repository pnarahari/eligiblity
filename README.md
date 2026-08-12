# Eligibility — Journey Combinations UI Mockup

Oracle **Visual Builder / Redwood**-style UI mockup for configuring **Leave of Absence Journey Combinations**, including pay-bucket sequencing and HCM / KPTime mappings.

## Open the mockup

```bash
# From repo root — any static server works
python3 -m http.server 8080 --directory mockup
```

Then open [http://localhost:8080](http://localhost:8080).

Or open `mockup/index.html` directly in a browser.

## What’s included

| Area | Behavior |
|------|----------|
| Collection list | Search + filters (pattern, reason, status, pay bucket) |
| Master–detail | Select a journey combination to inspect bucket rows |
| Bucket mappings table | Spreadsheet-aligned columns (seq, pay bucket, FMLA tracking, HCM types, PTYP, PAY CD, flags, hours mode) |
| Card view | Same mappings in Redwood-style cards |
| Data contract tab | Flat row JSON matching the spreadsheet columns |
| Create / Edit drawer | Journey header + default first bucket |
| Bucket drawer | Add/edit individual mapping rows |
| Export | CSV of flattened journey + bucket rows |

## Spreadsheet / data contract

Each flat row combines journey header fields with one bucket mapping:

- `Journey_Combination_ID`, `Journey_Combination_Key`
- `Leave_Pattern`, `Leave_Reason`, `Universal_LOA_Family_Code`
- `Pay_Bucket_Code`, `Bucket_Sequence`, `FMLA_Tracking_Bucket`
- `User_Selectable`, `Mandatory_Usage`, `Allowed_Selection_Mode`
- `Wait_Period_Applies`, `Wait_Substitute_Bucket`
- `Target_HCM_Absence_Type_Name`, `Universal_Absence_Type_ID`, `KPTIME_Absence_Type`
- `Primary_PTYP_CD_NW`, `Alternate_PTYP_CD_Candidates_NW`, `Derived_PAY_CD`
- `FMLA_Flag_Authoritative`, `Plan_Selection_Required`, `Hours_Mode`

Sample data lives in `mockup/js/data.js`.

## Visual Builder mapping notes

Suggested VB / Redwood components when implementing for real:

- `oj-sp-collection-container` / list view for journey combinations
- `oj-table` or `oj-dynamic-table` for bucket mappings
- `oj-drawer-popup` for create/edit forms
- `oj-select-single`, `oj-input-text`, `oj-switch` for form fields
- Business object: parent **JourneyCombination** → child **BucketMapping**
