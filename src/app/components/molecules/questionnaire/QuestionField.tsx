'use client';

import { Question, MemberField } from '@/lib/questionnaire/types';
import { PlusIcon, TrashIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface QuestionFieldProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export default function QuestionField({
  question,
  value,
  onChange,
  error
}: QuestionFieldProps) {
  const renderField = () => {
    switch (question.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={question.type === 'email' ? 'email' : question.type === 'phone' ? 'tel' : 'text'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.helpText ? '' : `Enter ${question.label.toLowerCase()}`}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            placeholder={question.helpText ? '' : `Enter ${question.label.toLowerCase()}`}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
        );

      case 'number':
      case 'currency':
        return (
          <div className="relative">
            {question.type === 'currency' && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            )}
            <input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(parseFloat(e.target.value) || '')}
              min={question.min}
              max={question.max}
              step={question.type === 'currency' ? '0.01' : '1'}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                question.type === 'currency' ? 'pl-8' : ''
              } ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select an option</option>
            {question.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                  value === opt.value
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-900">{opt.label}</span>
                  {opt.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{opt.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <span className="ml-3 text-gray-700">{question.label}</span>
          </label>
        );

      case 'checkbox_group':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {question.options?.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedValues.includes(opt.value)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selectedValues, opt.value]);
                    } else {
                      onChange(selectedValues.filter((v: string) => v !== opt.value));
                    }
                  }}
                  className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="ml-3 text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'address':
        const addressValue = value || { street: '', city: '', state: '', zipCode: '' };
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={addressValue.street || ''}
              onChange={(e) => onChange({ ...addressValue, street: e.target.value })}
              placeholder="Street Address"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                value={addressValue.city || ''}
                onChange={(e) => onChange({ ...addressValue, city: e.target.value })}
                placeholder="City"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={addressValue.state || ''}
                onChange={(e) => onChange({ ...addressValue, state: e.target.value })}
                placeholder="State"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="text"
                value={addressValue.zipCode || ''}
                onChange={(e) => onChange({ ...addressValue, zipCode: e.target.value })}
                placeholder="ZIP Code"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        );

      case 'member_list':
        return <MemberListField question={question} value={value} onChange={onChange} />;

      default:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  // For checkbox type, the label is rendered inside the field
  if (question.type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium text-gray-900">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {question.helpText && (
          <p className="text-sm text-gray-500 mt-1 flex items-start gap-1">
            <InformationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            {question.helpText}
          </p>
        )}
      </label>
      {renderField()}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

// Member List Field Component
function MemberListField({
  question,
  value,
  onChange
}: {
  question: Question;
  value: any;
  onChange: (value: any) => void;
}) {
  const members = Array.isArray(value) ? value : [];
  const memberFields = question.memberFields || [];

  const addMember = () => {
    const newMember: Record<string, any> = {};
    memberFields.forEach(field => {
      newMember[field.id] = field.type === 'number' ? 0 : '';
    });
    onChange([...members, newMember]);
  };

  const removeMember = (index: number) => {
    const updated = members.filter((_: any, i: number) => i !== index);
    onChange(updated);
  };

  const updateMember = (index: number, fieldId: string, fieldValue: any) => {
    const updated = members.map((m: any, i: number) => {
      if (i === index) {
        return { ...m, [fieldId]: fieldValue };
      }
      return m;
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {members.map((member: any, index: number) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">
              {memberFields.some(f => f.id === 'manager_name') ? 'Manager' : 'Member'} {index + 1}
            </h4>
            {members.length > 1 && (
              <button
                type="button"
                onClick={() => removeMember(index)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberFields.map((field) => (
              <div key={field.id} className={field.type === 'radio' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderMemberField(field, member[field.id], (val) => updateMember(index, field.id, val))}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addMember}
        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors w-full justify-center"
      >
        <PlusIcon className="w-5 h-5" />
        Add {memberFields.some(f => f.id === 'manager_name') ? 'Manager' : 'Member'}
      </button>
    </div>
  );
}

function renderMemberField(field: MemberField, value: any, onChange: (value: any) => void) {
  switch (field.type) {
    case 'radio':
      return (
        <div className="flex gap-4">
          {field.options?.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name={field.id}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      );
    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || '')}
          min={field.min}
          max={field.max}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      );
    default:
      return (
        <input
          type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      );
  }
}
