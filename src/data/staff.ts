import type { StaffMember } from "../types";

/**
 * The JMC Network staff roster, shown on the Staff page.
 *
 * This file is the single source of truth — add or edit members here.
 * Display order (owner first) and role copy live in StaffPage.
 */
export const staff: StaffMember[] = [
  { name: "Jace", role: "owner" },
  { name: "Aaron", role: "moderator" },
  { name: "Lewis", role: "judge" },
];
