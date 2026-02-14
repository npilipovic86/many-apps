export interface ICalculatorState {
  currentValue: number;
  previousValue: number;
  operation: string | null;
  display: string;
}

export interface ICalculation {
  operand1: number;
  operand2: number;
  operation: string;
  result: number;
}
