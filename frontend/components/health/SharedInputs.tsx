// @ts-nocheck
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sex, UnitSystem, ActivityLevel, activityLabels } from '@/lib/health/utils';

interface HeightInputProps {
  value: number;
  onChange: (value: number) => void;
  unit: UnitSystem;
  error?: string;
}

export function HeightInput({ value, onChange, unit, error }: HeightInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="height">
        Height ({unit === 'metric' ? 'cm' : 'inches'})
      </Label>
      <Input
        id="height"
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={unit === 'metric' ? 100 : 36}
        max={unit === 'metric' ? 250 : 96}
        step="0.1"
        aria-describedby={error ? 'height-error' : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <p id="height-error" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

interface WeightInputProps {
  value: number;
  onChange: (value: number) => void;
  unit: UnitSystem;
  error?: string;
}

export function WeightInput({ value, onChange, unit, error }: WeightInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="weight">
        Weight ({unit === 'metric' ? 'kg' : 'lbs'})
      </Label>
      <Input
        id="weight"
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={unit === 'metric' ? 30 : 66}
        max={unit === 'metric' ? 300 : 660}
        step="0.1"
        aria-describedby={error ? 'weight-error' : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <p id="weight-error" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

interface AgeInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function AgeInput({ value, onChange, error }: AgeInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="age">Age (years)</Label>
      <Input
        id="age"
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min={1}
        max={120}
        aria-describedby={error ? 'age-error' : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <p id="age-error" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

interface SexInputProps {
  value: Sex;
  onChange: (value: Sex) => void;
}

export function SexInput({ value, onChange }: SexInputProps) {
  return (
    <div className="space-y-2">
      <Label>Sex</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as Sex)}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="male" />
          <Label htmlFor="male" className="font-normal cursor-pointer">
            Male
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="female" />
          <Label htmlFor="female" className="font-normal cursor-pointer">
            Female
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

interface UnitToggleProps {
  value: UnitSystem;
  onChange: (value: UnitSystem) => void;
}

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="space-y-2">
      <Label>Unit System</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as UnitSystem)}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="metric" id="metric" />
          <Label htmlFor="metric" className="font-normal cursor-pointer">
            Metric
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="imperial" id="imperial" />
          <Label htmlFor="imperial" className="font-normal cursor-pointer">
            Imperial
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

interface ActivitySelectProps {
  value: ActivityLevel;
  onChange: (value: ActivityLevel) => void;
}

export function ActivitySelect({ value, onChange }: ActivitySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="activity">Activity Level</Label>
      <Select value={value} onValueChange={(v) => onChange(v as ActivityLevel)}>
        <SelectTrigger id="activity">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(activityLabels) as ActivityLevel[]).map((level) => (
            <SelectItem key={level} value={level}>
              {activityLabels[level]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface CircumferenceInputProps {
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  unit: UnitSystem;
  error?: string;
}

export function CircumferenceInput({ label, id, value, onChange, unit, error }: CircumferenceInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} ({unit === 'metric' ? 'cm' : 'inches'})
      </Label>
      <Input
        id={id}
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={unit === 'metric' ? 10 : 4}
        max={unit === 'metric' ? 200 : 80}
        step="0.1"
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
