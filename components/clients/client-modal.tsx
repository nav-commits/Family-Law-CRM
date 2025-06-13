import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ClientForm {
  name: string;
  email: string;
  phone: string;
  caseType: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  billableHours: number | '';
}

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  newClient: ClientForm;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ClientModal({
  isOpen,
  onClose,
  newClient,
  onInputChange,
  onSubmit,
}: Readonly<AddClientModalProps>) {
  if (!isOpen) return null;

  // Define text inputs configuration
  const textInputs = [
    { placeholder: 'Name', name: 'name', type: 'text', required: true },
    { placeholder: 'Email', name: 'email', type: 'email', required: true },
    { placeholder: 'Phone', name: 'phone', type: 'text', required: true },
    { placeholder: 'Case Type', name: 'caseType', type: 'text', required: true },
    { placeholder: 'Billable Hours', name: 'billableHours', type: 'number', min: 0, step: 0.25, required: true },
  ];

  // Define select options
  const statusOptions = ['active', 'closed', 'pending'] as const;
  const priorityOptions = ['high', 'medium', 'low'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Client</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          {textInputs.map(({ placeholder, name, type, min, step, required }) => (
            <Input
              key={name}
              placeholder={placeholder}
              name={name}
              type={type}
              min={min}
              step={step}
              value={newClient[name as keyof ClientForm] as string | number}
              onChange={onInputChange}
              required={required}
            />
          ))}
          <select
            name="status"
            value={newClient.status}
            onChange={onInputChange}
            className="w-full p-2 border rounded"
            required
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={newClient.priority}
            onChange={onInputChange}
            className="w-full p-2 border rounded"
            required
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>

          <Button type="submit" className="w-full">
            Add Client
          </Button>
        </form>
      </div>
    </div>
  );
}
