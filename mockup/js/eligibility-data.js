/**
 * Eligibility Rules sample data
 * Mirrors the LOA eligibility spreadsheet columns.
 */
window.ELIGIBILITY_DATA = {
  states: ["Oregon", "Washington", "California"],
  regions: ["Northwest", "Southwest", "Statewide"],
  regulations: [
    "Family and Medical Leave Act (FMLA)",
    "Paid Leave Oregon (PLO)",
    "FMLA Military Caregiver Leave",
    "Policy",
    "CBA"
  ],
  leaveTypes: [
    "Leave of Absence Family Care Integrated M",
    "Leave of Absence Family Care M",
    "Leave of Absence Military Caregiver Integrated M",
    "Leave of Absence Industrial M",
    "Leave of Absence Medical Integrated M",
    "Leave of Absence Medical M",
    "Leave of Absence Bonding Integrated M"
  ],

  /**
   * Master records: one leave type + state/region,
   * with child regulation eligibility rows.
   */
  rules: [
    {
      ruleId: "ELIG_OR_FC_INT_01",
      legacyLeaveType: "Leave of Absence Family Care Integrated M",
      state: "Oregon",
      region: "Northwest",
      status: "Active",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Paid Leave Oregon (PLO)",
          minServiceMonths: 6,
          minServiceHours: "",
          minWeeklyHours: "N/A",
          minEarningCheck: 1000,
          rollingPeriodMonths: "",
          durationWeeks: 12,
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
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
      ruleId: "ELIG_OR_FC_01",
      legacyLeaveType: "Leave of Absence Family Care M",
      state: "Oregon",
      region: "Northwest",
      status: "Active",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Paid Leave Oregon (PLO)",
          minServiceMonths: 6,
          minServiceHours: "",
          minWeeklyHours: "N/A",
          minEarningCheck: 1000,
          rollingPeriodMonths: "",
          durationWeeks: 12,
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
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
      ruleId: "ELIG_OR_MC_INT_01",
      legacyLeaveType: "Leave of Absence Military Caregiver Integrated M",
      state: "Oregon",
      region: "Northwest",
      status: "Active",
      regulations: [
        {
          regulation: "FMLA Military Caregiver Leave",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "",
          rollingPeriodMonths: 12,
          durationWeeks: 26,
          durationHours: 1040,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
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
      ruleId: "ELIG_OR_IND_01",
      legacyLeaveType: "Leave of Absence Industrial M",
      state: "Oregon",
      region: "Northwest",
      status: "Active",
      regulations: [
        {
          regulation: "Policy",
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
      ruleId: "ELIG_OR_MED_INT_01",
      legacyLeaveType: "Leave of Absence Medical Integrated M",
      state: "Oregon",
      region: "Northwest",
      status: "Active",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Paid Leave Oregon (PLO)",
          minServiceMonths: 6,
          minServiceHours: "",
          minWeeklyHours: "N/A",
          minEarningCheck: 1000,
          rollingPeriodMonths: "",
          durationWeeks: 12,
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
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
      ruleId: "ELIG_OR_MED_01",
      legacyLeaveType: "Leave of Absence Medical M",
      state: "Oregon",
      region: "Northwest",
      status: "Draft",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Paid Leave Oregon (PLO)",
          minServiceMonths: 6,
          minServiceHours: "",
          minWeeklyHours: "N/A",
          minEarningCheck: 1000,
          rollingPeriodMonths: "",
          durationWeeks: 12,
          durationHours: "",
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
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
      ruleId: "ELIG_WA_BOND_INT_01",
      legacyLeaveType: "Leave of Absence Bonding Integrated M",
      state: "Washington",
      region: "Northwest",
      status: "Inactive",
      regulations: [
        {
          regulation: "Family and Medical Leave Act (FMLA)",
          minServiceMonths: 12,
          minServiceHours: 1250,
          minWeeklyHours: "N/A",
          minEarningCheck: "",
          rollingPeriodMonths: 12,
          durationWeeks: 12,
          durationHours: 480,
          maxCombinedWeeks: "",
          jobProtection: "Y"
        },
        {
          regulation: "Policy",
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
