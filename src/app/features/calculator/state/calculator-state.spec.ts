import { TestBed } from '@angular/core/testing';
import { CalculatorState } from './calculator-state';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CalculatorState', () => {
    let service: CalculatorState;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CalculatorState]
        });
        service = TestBed.inject(CalculatorState);
    });

    describe('Initial State', () => {
        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should have display set to 0 initially', () => {
            expect(service.display()).toBe('0');
        });

        it('should have null operation initially', () => {
            expect(service.currentOperation()).toBeNull();
        });

        it('should have correct initial state', () => {
            const state = service.getState();
            expect(state).toEqual({
                currentValue: 0,
                previousValue: 0,
                operation: null,
                display: '0'
            });
        });
    });

    describe('updateDisplay', () => {
        it('should update display value', () => {
            service.updateDisplay('123');
            expect(service.display()).toBe('123');
        });

        it('should handle string numbers', () => {
            service.updateDisplay('456');
            expect(service.display()).toBe('456');
        });

        it('should update display multiple times', () => {
            service.updateDisplay('1');
            expect(service.display()).toBe('1');

            service.updateDisplay('12');
            expect(service.display()).toBe('12');

            service.updateDisplay('123');
            expect(service.display()).toBe('123');
        });

        it('should not affect other state properties', () => {
            service.setOperation('+');
            const operationBefore = service.currentOperation();

            service.updateDisplay('999');

            expect(service.currentOperation()).toBe(operationBefore);
        });
    });

    describe('setOperation', () => {
        it('should set operation', () => {
            service.setOperation('+');
            expect(service.currentOperation()).toBe('+');
        });

        it('should store previous value from display', () => {
            service.updateDisplay('25');
            service.setOperation('+');

            const state = service.getState();
            expect(state.previousValue).toBe(25);
        });

        it('should reset current value to 0', () => {
            service.updateDisplay('10');
            service.setOperation('-');

            const state = service.getState();
            expect(state.currentValue).toBe(0);
        });

        it('should handle different operations', () => {
            service.setOperation('+');
            expect(service.currentOperation()).toBe('+');

            service.setOperation('-');
            expect(service.currentOperation()).toBe('-');

            service.setOperation('*');
            expect(service.currentOperation()).toBe('*');

            service.setOperation('/');
            expect(service.currentOperation()).toBe('/');
        });

        it('should parse display value correctly', () => {
            service.updateDisplay('42.5');
            service.setOperation('*');

            const state = service.getState();
            expect(state.previousValue).toBe(42.5);
        });
    });

    describe('reset', () => {
        it('should reset to initial state', () => {
            service.updateDisplay('123');
            service.setOperation('+');

            service.reset();

            const state = service.getState();
            expect(state).toEqual({
                currentValue: 0,
                previousValue: 0,
                operation: null,
                display: '0'
            });
        });

        it('should reset display to 0', () => {
            service.updateDisplay('999');
            service.reset();
            expect(service.display()).toBe('0');
        });

        it('should clear operation', () => {
            service.setOperation('*');
            service.reset();
            expect(service.currentOperation()).toBeNull();
        });

        it('should reset all values', () => {
            service.updateDisplay('50');
            service.setOperation('/');

            service.reset();

            const state = service.getState();
            expect(state.currentValue).toBe(0);
            expect(state.previousValue).toBe(0);
            expect(state.operation).toBeNull();
            expect(state.display).toBe('0');
        });
    });

    describe('getState', () => {
        it('should return current state', () => {
            const state = service.getState();
            expect(state).toBeDefined();
            expect(state).toHaveProperty('display');
            expect(state).toHaveProperty('operation');
            expect(state).toHaveProperty('currentValue');
            expect(state).toHaveProperty('previousValue');
        });

        it('should return updated state after changes', () => {
            service.updateDisplay('100');
            service.setOperation('+');

            const state = service.getState();
            expect(state.display).toBe('100');
            expect(state.operation).toBe('+');
            expect(state.previousValue).toBe(100);
        });
    });

    describe('Signal Reactivity', () => {
        it('should update computed display signal', () => {
            expect(service.display()).toBe('0');

            service.updateDisplay('42');
            expect(service.display()).toBe('42');
        });

        it('should update computed operation signal', () => {
            expect(service.currentOperation()).toBeNull();

            service.setOperation('+');
            expect(service.currentOperation()).toBe('+');
        });

        it('should maintain reactivity across multiple updates', () => {
            service.updateDisplay('10');
            expect(service.display()).toBe('10');

            service.setOperation('+');
            expect(service.currentOperation()).toBe('+');

            service.updateDisplay('20');
            expect(service.display()).toBe('20');

            service.reset();
            expect(service.display()).toBe('0');
            expect(service.currentOperation()).toBeNull();
        });
    });
});
