import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SavingsCreate from './SavingsCreate';
import { saveSavingsData } from '../services/SavingsService';
import { IonReactRouter } from '@ionic/react-router';
import { IonApp } from '@ionic/react';

// Mock the SavingsService
jest.mock('../services/SavingsService', () => ({
  saveSavingsData: jest.fn()
}));

const mockOnCancel = jest.fn();

describe('SavingsCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <IonApp>
        <IonReactRouter>
          <SavingsCreate onCancel={mockOnCancel} />
        </IonReactRouter>
      </IonApp>
    );
  };

  it('renders all form fields', () => {
    renderComponent();
    
    expect(screen.getByText('Goal Name')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Initial Amount')).toBeInTheDocument();
    expect(screen.getByText('Target Amount')).toBeInTheDocument();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('Target Date')).toBeInTheDocument();
    expect(screen.getByText('Additional Notes')).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    renderComponent();
    
    // Try to submit empty form
    const submitButton = screen.getByText('Create Savings Goal');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Saving name is required')).toBeInTheDocument();
      expect(screen.getByText('Saving type is required')).toBeInTheDocument();
    });
  });

  it('validates amount fields correctly', async () => {
    renderComponent();
    
    // Set invalid amounts
    const initialAmount = screen.getByPlaceholderText('0.00');
    const targetAmount = screen.getAllByPlaceholderText('0.00')[1];

    await userEvent.type(initialAmount, '-100');
    await userEvent.type(targetAmount, '50');

    // Try to submit
    const submitButton = screen.getByText('Create Savings Goal');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Amount cannot be negative')).toBeInTheDocument();
      expect(screen.getByText('Maturity amount must be greater than initial amount')).toBeInTheDocument();
    });
  });

  it('calculates monthly contribution correctly', async () => {
    renderComponent();
    
    // Set valid amounts and dates
    const initialAmount = screen.getByPlaceholderText('0.00');
    const targetAmount = screen.getAllByPlaceholderText('0.00')[1];

    await userEvent.type(initialAmount, '1000');
    await userEvent.type(targetAmount, '13000');

    // Set dates one year apart
    const startDateBtn = screen.getByText('Start Date');
    const endDateBtn = screen.getByText('Target Date');

    await userEvent.click(startDateBtn);
    fireEvent.change(screen.getByTestId('startDate'), { target: { value: '2025-08-13' } });
    
    await userEvent.click(endDateBtn);
    fireEvent.change(screen.getByTestId('endDate'), { target: { value: '2026-08-13' } });

    // Click calculate button
    const calculateButton = screen.getByTestId('calculate-button');
    await userEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText('$1000.00')).toBeInTheDocument(); // Monthly contribution
    });
  });

  it('successfully submits the form with valid data', async () => {
    renderComponent();
    
    // Fill in all required fields
    await userEvent.type(
      screen.getByPlaceholderText('Enter your savings goal name'),
      'Vacation Fund'
    );
    
    const typeSelect = screen.getByPlaceholderText('Select savings type');
    fireEvent.change(typeSelect, { target: { value: 'FD' } });

    await userEvent.type(screen.getByPlaceholderText('0.00'), '1000');
    await userEvent.type(screen.getAllByPlaceholderText('0.00')[1], '13000');
    
    // Set dates
    fireEvent.change(screen.getByTestId('startDate'), { target: { value: '2025-08-13' } });
    fireEvent.change(screen.getByTestId('endDate'), { target: { value: '2026-08-13' } });

    // Add some notes
    await userEvent.type(
      screen.getByPlaceholderText('Add any notes or details about your savings goal'),
      'Saving for summer vacation'
    );

    // Submit the form
    const submitButton = screen.getByText('Create Savings Goal');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(saveSavingsData).toHaveBeenCalledWith(expect.objectContaining({
        savingName: 'Vacation Fund',
        savingType: 'FD',
        amount: 1000,
        maturityAmount: 13000,
        comments: 'Saving for summer vacation'
      }));
    });

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('handles file attachments correctly', async () => {
    renderComponent();
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByTestId('file-input');

    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check if file name is displayed
    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    // Test file removal
    const removeButton = screen.getByTestId('remove-file');
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    });
  });
});
