import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from './services/calculator';
import { CalculatorState } from './state/calculator-state';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css'
})
export class CalculatorComponent {

  private calculatorService = inject(CalculatorService);
  public calculatorState = inject(CalculatorState);

  display = this.calculatorState.display;
  currentOperation = this.calculatorState.currentOperation;
  history = computed(() => [...this.calculatorService.getCalculationHistory()].reverse().slice(0, 5));


  onNumberClick(num: string) {
    const currentDisplay = this.display();
    const newDisplay = currentDisplay === '0' ? num : currentDisplay + num;
    this.calculatorState.updateDisplay(newDisplay);
  }

  onOperationClick(operation: string) {
    this.calculatorState.setOperation(operation);
    this.calculatorState.updateDisplay('0');
  }

  onEqualsClick() {
    const state = this.calculatorState.getState();
    if (state.operation) {
      const result = this.calculatorService.calculate(
        state.previousValue,
        parseFloat(state.display),
        state.operation
      );

      this.calculatorState.updateDisplay(result.toString());

      this.calculatorService.saveCalculation({
        operand1: state.previousValue,
        operand2: parseFloat(state.display),
        operation: state.operation,
        result
      });
    }
  }

  onClear() {
    this.calculatorState.reset();
  }

  onDelete() {
    const currentDisplay = this.display();
    if (currentDisplay.length > 1) {
      this.calculatorState.updateDisplay(currentDisplay.slice(0, -1));
    } else {
      this.calculatorState.updateDisplay('0');
    }
  }
}
