import { printLeftoverKeys, verifyArray, verifyType } from ".";

export interface GroupState {
  all_on: boolean;
  any_on: boolean;
}

export function create(payload: any): GroupState {
  if (!payload) { throw new Error("GroupState not found"); }
  const groupState = {
    all_on: verifyType(payload.all_on, "all_on", "boolean"),
    any_on: verifyType(payload.any_on, "any_on", "boolean"),
  };
  printLeftoverKeys("GroupState", payload, groupState);
  return groupState;
}