import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator';
import { CalculatorService } from './services/calculator';
import { CalculatorState } from './state/calculator-state';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CalculatorComponent', () => {
    let component: CalculatorComponent;
    let fixture: ComponentFixture<CalculatorComponent>;
    let calculatorService: CalculatorService;
    let calculatorState: CalculatorState;

    beforeEach(async () => {
        // Clear localStorage before component creation
        localStorage.clear();

        await TestBed.configureTestingModule({
            imports: [CalculatorComponent],
            providers: [CalculatorService, CalculatorState]
        }).compileComponents();

        fixture = TestBed.createComponent(CalculatorComponent);
        component = fixture.componentInstance;
        calculatorService = TestBed.inject(CalculatorService);
        calculatorState = TestBed.inject(CalculatorState);

        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should have display signal from state', () => {
            expect(component.display()).toBe('0');
        });

        it('should have currentOperation signal from state', () => {
            expect(component.currentOperation()).toBeNull();
        });

        it('should have empty history initially', () => {
            expect(component.history().length).toBe(0);
        });
    });

    describe('onNumberClick', () => {
        it('should replace 0 with clicked number', () => {
            component.onNumberClick('5');
            expect(component.display()).toBe('5');
        });

        it('should append number to existing display', () => {
            calculatorState.updateDisplay('12');
            component.onNumberClick('3');
            expect(component.display()).toBe('123');
        });

        it('should handle multiple number clicks', () => {
            component.onNumberClick('1');
            component.onNumberClick('2');
            component.onNumberClick('3');
            expect(component.display()).toBe('123');
        });

        it('should handle zero as a number', () => {
            component.onNumberClick('5');
            component.onNumberClick('0');
            expect(component.display()).toBe('50');
        });
    });

    describe('onOperationClick', () => {
        it('should set operation and reset display', () => {
            calculatorState.updateDisplay('10');
            component.onOperationClick('+');

            expect(component.currentOperation()).toBe('+');
            expect(component.display()).toBe('0');
        });

        it('should handle different operations', () => {
            component.onOperationClick('-');
            expect(component.currentOperation()).toBe('-');

            component.onOperationClick('*');
            expect(component.currentOperation()).toBe('*');

            component.onOperationClick('/');
            expect(component.currentOperation()).toBe('/');
        });

        it('should store previous value when operation is clicked', () => {
            calculatorState.updateDisplay('25');
            component.onOperationClick('+');

            const state = calculatorState.getState();
            expect(state.previousValue).toBe(25);
        });
    });

    describe('onEqualsClick', () => {
        it('should calculate addition', () => {
            calculatorState.updateDisplay('10');
            component.onOperationClick('+');
            calculatorState.updateDisplay('5');
            component.onEqualsClick();

            expect(component.display()).toBe('15');
        });

        it('should calculate subtraction', () => {
            calculatorState.updateDisplay('20');
            component.onOperationClick('-');
            calculatorState.updateDisplay('8');
            component.onEqualsClick();

            expect(component.display()).toBe('12');
        });

        it('should calculate multiplication', () => {
            calculatorState.updateDisplay('6');
            component.onOperationClick('*');
            calculatorState.updateDisplay('7');
            component.onEqualsClick();

            expect(component.display()).toBe('42');
        });

        it('should calculate division', () => {
            calculatorState.updateDisplay('20');
            component.onOperationClick('/');
            calculatorState.updateDisplay('4');
            component.onEqualsClick();

            expect(component.display()).toBe('5');
        });

        it('should save calculation to history', () => {
            calculatorState.updateDisplay('10');
            component.onOperationClick('+');
            calculatorState.updateDisplay('5');
            component.onEqualsClick();

            const history = calculatorService.getCalculationHistory();
            expect(history.length).toBe(1);
            expect(history[0]).toEqual({
                operand1: 10,
                operand2: 5,
                operation: '+',
                result: 15
            });
        });

        it('should not calculate if no operation is set', () => {
            calculatorState.updateDisplay('10');
            component.onEqualsClick();

            expect(component.display()).toBe('10');
        });
    });

    describe('onClear', () => {
        it('should reset calculator to initial state', () => {
            calculatorState.updateDisplay('123');
            component.onOperationClick('+');

            component.onClear();

            expect(component.display()).toBe('0');
            expect(component.currentOperation()).toBeNull();
        });

        it('should clear display and operation', () => {
            calculatorState.updateDisplay('999');
            component.onOperationClick('*');

            component.onClear();

            const state = calculatorState.getState();
            expect(state.display).toBe('0');
            expect(state.operation).toBeNull();
            expect(state.previousValue).toBe(0);
        });
    });

    describe('onDelete', () => {
        it('should remove last digit from display', () => {
            calculatorState.updateDisplay('123');
            component.onDelete();
            expect(component.display()).toBe('12');
        });

        it('should set display to 0 when deleting last digit', () => {
            calculatorState.updateDisplay('5');
            component.onDelete();
            expect(component.display()).toBe('0');
        });

        it('should handle multiple deletes', () => {
            calculatorState.updateDisplay('12345');
            component.onDelete();
            component.onDelete();
            component.onDelete();
            expect(component.display()).toBe('12');
        });

        it('should keep 0 when deleting from 0', () => {
            calculatorState.updateDisplay('0');
            component.onDelete();
            expect(component.display()).toBe('0');
        });
    });

    describe('History', () => {
        it('should show last 5 calculations in reverse order', () => {
            // Add 6 calculations
            for (let i = 1; i <= 6; i++) {
                calculatorService.saveCalculation({
                    operand1: i,
                    operand2: i,
                    operation: '+',
                    result: i * 2
                });
            }

            const history = component.history();
            expect(history.length).toBe(5);
            expect(history[0].operand1).toBe(6); // Most recent first
            expect(history[4].operand1).toBe(2); // Oldest of the 5
        });
    });
});
