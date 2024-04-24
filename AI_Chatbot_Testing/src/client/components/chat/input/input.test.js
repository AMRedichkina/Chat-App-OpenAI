import React, { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import InputComponent from './input';

describe('InputComponent', () => {
    let sendMessage;
    let ref;

    beforeEach(() => {
        sendMessage = jest.fn();
        ref = createRef();
        render(<InputComponent sendMessage={sendMessage} ref={ref}/>);
    })

    it('focuses on the input field after rendering', () => {
        const input = screen.getByPlaceholderText('Type your message...');
        expect(input).toHaveFocus();
    });

    it('updates input value on change', () => {
        const input = screen.getByPlaceholderText('Type your message...');
        fireEvent.change(input, {target: {value: 'Hello'}});
        expect(input.value).toBe('Hello');
    });

    it('calls sendMessage on Enter key press', () => {
        const input = screen.getByPlaceholderText('Type your message...');
        fireEvent.keyPress(input, {key: 'Enter', code: 'Enter', charCode: 13});
        expect(sendMessage).toHaveBeenCalledWith('');
    });

    it('calls sendMessage and clears the input in Enter key press', () => {
        const input = screen.getByPlaceholderText('Type your message...');
        fireEvent.change(input, {target: {value: 'Hello'}});
        fireEvent.keyPress(input, {key: 'Enter', code: 'Enter', charCode: 13});
        expect(sendMessage).toHaveBeenCalledWith('Hello');
        expect(input.value).toBe('');
    })
    it('calls sendMessage and clears the input on send icon click', () => {
        const input = screen.getByPlaceholderText('Type your message...');
        const sendIcon = screen.getByTestId('send-icon');
        fireEvent.change(input, {target: {value: 'Hello'}});
        fireEvent.click(sendIcon);
        expect(sendMessage).toHaveBeenCalledWith('Hello');
        expect(input.value).toBe('');
    });
});
