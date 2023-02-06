type Operator =
  | "contains"
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual";

interface FilterObject {
  type: Operator;
  filter: string;
}
