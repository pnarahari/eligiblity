/**
 * Universal LOA Family eligibility sample data
 * Columns: Universal_LOA_Family_Name, State, Region, Regulation, Regulation_Type,
 * Min_Service_Months/Hours, Min_Weekly_Hours, Min_Earning_Check, Rolling_Period_Months,
 * Duration_Weeks/Hours, Max_Combined_Weeks, Job_Protection
 */
window.UNIVERSAL_ELIGIBILITY_DATA = {
  states: ["Oregon", "Washington", "California"],
  regions: ["Northwest", "Southwest", "Statewide"],
  familyNames: [
    "Family Care / Bonding",
    "Military Caregiver",
    "Employee Medical",
    "Industrial",
    "Qualifying Exigency"
  ],
  regulations: [
    "Family and Medical Leave Act (FMLA)",
    "Paid Leave Oregon (PLO)",
    "FMLA Military Caregiver Leave",
    "Policy",
    "CBA"
  ],
  regulationTypes: [
    "Federal_FMLA",
    "Federal_FMLA_MilCaregiver",
    "State_Oregon_Paid",
    "KP_National_Policy",
    "Union_CBA"
  ],

  rules: [
    {
      ruleId: "UELIG_OR_FCB_01",
      universalLoaFamilyName: "Family Care / Bonding",
      state: "Oregon",
      region: "Northwest",
      status: "Active",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          regulationType: "Federal_FMLA",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "N/A",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Paid Leave Oregon (PLO)",
          regulationType: "State_Oregon_Paid",
          minServiceMonths: 6,
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: 1000,
          rollingPeriodMonths: "",
          durationWeeks: 12,
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
          regulationType: "KP_National_Policy",
          minServiceMonths: "",
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: "",
          rollingPeriodMonths: "",
          durationWeeks: "",
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "CBA",
          regulationType: "Union_CBA",
          minServiceMonths: "",
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: "",
          rollingPeriodMonths: "",
          durationWeeks: "",
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        }
      ]
    },
    {
      ruleId: "UELIG_OR_MC_01",
      universalLoaFamilyName: "Military Caregiver",
      state: "Oregon",
      region: "Northwest",
      status: "Active",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          regulationType: "Federal_FMLA",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "N/A",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "FMLA Military Caregiver Leave",
          regulationType: "Federal_FMLA_MilCaregiver",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "N/A",
          rollingPeriodMonths: 12,
          durationWeeks: "",
          durationHours: 1040,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Paid Leave Oregon (PLO)",
          regulationType: "State_Oregon_Paid",
          minServiceMonths: 6,
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: 1000,
          rollingPeriodMonths: "",
          durationWeeks: 12,
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        }
      ]
    },
    {
      ruleId: "UELIG_OR_MED_01",
      universalLoaFamilyName: "Employee Medical",
      state: "Oregon",
      region: "Northwest",
      status: "Active",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          regulationType: "Federal_FMLA",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "N/A",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Paid Leave Oregon (PLO)",
          regulationType: "State_Oregon_Paid",
          minServiceMonths: 6,
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: 1000,
          rollingPeriodMonths: "",
          durationWeeks: 12,
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
          regulationType: "KP_National_Policy",
          minServiceMonths: "",
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: "",
          rollingPeriodMonths: "",
          durationWeeks: "",
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "CBA",
          regulationType: "Union_CBA",
          minServiceMonths: "",
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: "",
          rollingPeriodMonths: "",
          durationWeeks: "",
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        }
      ]
    },
    {
      ruleId: "UELIG_OR_IND_01",
      universalLoaFamilyName: "Industrial",
      state: "Oregon",
      region: "Northwest",
      status: "Draft",
      regulations: [
        {
          regulation: "Policy",
          regulationType: "KP_National_Policy",
          minServiceMonths: "",
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: "",
          rollingPeriodMonths: "",
          durationWeeks: "",
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "CBA",
          regulationType: "Union_CBA",
          minServiceMonths: "",
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: "",
          rollingPeriodMonths: "",
          durationWeeks: "",
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        }
      ]
    },
    {
      ruleId: "UELIG_OR_QE_01",
      universalLoaFamilyName: "Qualifying Exigency",
      state: "Oregon",
      region: "Northwest",
      status: "Inactive",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          regulationType: "Federal_FMLA",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "N/A",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
          regulationType: "KP_National_Policy",
          minServiceMonths: "",
          minServiceHours: "",
          minWeeklyHours: "",
          minEarningCheck: "",
          rollingPeriodMonths: "",
          durationWeeks: "",
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        }
      ]
    }
  ]
};
