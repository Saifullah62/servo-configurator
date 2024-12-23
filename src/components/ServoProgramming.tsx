import React, { useState } from 'react';
import { ServoProgram, ServoProgramStep } from '../types/servo';

interface ServoProgrammingProps {
  programs: ServoProgram[];
  activeProgram?: string;
  onProgramChange: (programs: ServoProgram[]) => void;
  onActiveProgramChange: (programId: string | undefined) => void;
  disabled?: boolean;
}

export const ServoProgramming: React.FC<ServoProgrammingProps> = ({
  programs = [],
  activeProgram,
  onProgramChange,
  onActiveProgramChange,
  disabled = false,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<ServoProgram | undefined>(
    programs.length > 0 ? programs.find(p => p.id === activeProgram) || programs[0] : undefined
  );
  const [editingStep, setEditingStep] = useState<ServoProgramStep | undefined>();
  const [editingStepIndex, setEditingStepIndex] = useState<number>(-1);

  const handleCreateProgram = () => {
    const newProgram: ServoProgram = {
      id: Date.now().toString(),
      name: 'New Program',
      description: '',
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onProgramChange([...programs, newProgram]);
    setSelectedProgram(newProgram);
  };

  const handleDeleteProgram = (programId: string) => {
    const updatedPrograms = programs.filter(p => p.id !== programId);
    onProgramChange(updatedPrograms);
    if (selectedProgram?.id === programId) {
      setSelectedProgram(undefined);
    }
    if (activeProgram === programId) {
      onActiveProgramChange(undefined);
    }
  };

  const handleUpdateProgram = (programId: string, updates: Partial<ServoProgram>) => {
    const updatedPrograms = programs.map(p => {
      if (p.id === programId) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });
    onProgramChange(updatedPrograms);
    if (selectedProgram?.id === programId) {
      setSelectedProgram(updatedPrograms.find(p => p.id === programId));
    }
  };

  const handleAddStep = () => {
    if (!selectedProgram) return;
    
    const newStep: ServoProgramStep = {
      type: 'move',
      value: 90,
      duration: 1000,
    };
    setEditingStep(newStep);
    setEditingStepIndex(selectedProgram.steps.length);
  };

  const handleSaveStep = (step: ServoProgramStep) => {
    if (!selectedProgram) return;

    const newSteps = [...selectedProgram.steps];
    if (editingStepIndex === -1) {
      newSteps.push(step);
    } else {
      newSteps[editingStepIndex] = step;
    }

    handleUpdateProgram(selectedProgram.id, { steps: newSteps });
    setEditingStep(undefined);
    setEditingStepIndex(-1);
  };

  const handleDeleteStep = (index: number) => {
    if (!selectedProgram) return;

    const newSteps = selectedProgram.steps.filter((_, i) => i !== index);
    handleUpdateProgram(selectedProgram.id, { steps: newSteps });
  };

  const renderStepEditor = () => {
    if (!editingStep) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingStepIndex === -1 ? 'Add Step' : 'Edit Step'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={editingStep.type}
                onChange={(e) => setEditingStep({ ...editingStep, type: e.target.value as ServoProgramStep['type'] })}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="move">Move</option>
                <option value="wait">Wait</option>
                <option value="repeat">Repeat</option>
                <option value="speed">Set Speed</option>
                <option value="acceleration">Set Acceleration</option>
                <option value="home">Home Position</option>
              </select>
            </div>

            {editingStep.type === 'move' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Angle
                </label>
                <input
                  type="number"
                  value={editingStep.value}
                  onChange={(e) => setEditingStep({ ...editingStep, value: Number(e.target.value) })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={0}
                  max={180}
                />
              </div>
            )}

            {(editingStep.type === 'move' || editingStep.type === 'wait') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (ms)
                </label>
                <input
                  type="number"
                  value={editingStep.duration}
                  onChange={(e) => setEditingStep({ ...editingStep, duration: Number(e.target.value) })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={0}
                />
              </div>
            )}

            {editingStep.type === 'repeat' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repeat Count
                </label>
                <input
                  type="number"
                  value={editingStep.repeatCount}
                  onChange={(e) => setEditingStep({ ...editingStep, repeatCount: Number(e.target.value) })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={1}
                />
              </div>
            )}

            {(editingStep.type === 'speed' || editingStep.type === 'acceleration') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </label>
                <input
                  type="number"
                  value={editingStep.value}
                  onChange={(e) => setEditingStep({ ...editingStep, value: Number(e.target.value) })}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={0}
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setEditingStep(undefined);
                setEditingStepIndex(-1);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveStep(editingStep)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepDisplay = (step: ServoProgramStep, index: number) => {
    let stepDescription = '';
    switch (step.type) {
      case 'move':
        stepDescription = `Move to ${step.value}° in ${step.duration}ms`;
        break;
      case 'wait':
        stepDescription = `Wait for ${step.duration}ms`;
        break;
      case 'repeat':
        stepDescription = `Repeat ${step.repeatCount} times`;
        break;
      case 'speed':
        stepDescription = `Set speed to ${step.value}°/s`;
        break;
      case 'acceleration':
        stepDescription = `Set acceleration to ${step.value}°/s²`;
        break;
      case 'home':
        stepDescription = 'Return to home position';
        break;
    }

    return (
      <div 
        key={index}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div className="flex items-center space-x-3">
          <span className="text-gray-500">{index + 1}.</span>
          <span className="text-gray-900">{stepDescription}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setEditingStep(step);
              setEditingStepIndex(index);
            }}
            disabled={disabled}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteStep(index)}
            disabled={disabled}
            className="p-1 text-red-400 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Programs</h3>
        <button
          onClick={handleCreateProgram}
          disabled={disabled}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          New Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program List */}
        <div className="space-y-4">
          {programs.map((program) => (
            <div
              key={program.id}
              className={`p-4 rounded-lg border ${
                selectedProgram?.id === program.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="cursor-pointer"
                  onClick={() => setSelectedProgram(program)}
                >
                  <h4 className="font-medium text-gray-900">{program.name}</h4>
                  {program.description && (
                    <p className="text-sm text-gray-500 mt-1">{program.description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {activeProgram === program.id ? (
                    <button
                      onClick={() => onActiveProgramChange(undefined)}
                      disabled={disabled}
                      className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      onClick={() => onActiveProgramChange(program.id)}
                      disabled={disabled}
                      className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200"
                    >
                      Run
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteProgram(program.id)}
                    disabled={disabled}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {programs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No programs created yet. Click "New Program" to get started.
            </div>
          )}
        </div>

        {/* Program Editor */}
        {selectedProgram && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program Name
              </label>
              <input
                type="text"
                value={selectedProgram.name}
                onChange={(e) => handleUpdateProgram(selectedProgram.id, { name: e.target.value })}
                disabled={disabled}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={selectedProgram.description || ''}
                onChange={(e) => handleUpdateProgram(selectedProgram.id, { description: e.target.value })}
                disabled={disabled}
                rows={3}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Steps
                </label>
                <button
                  onClick={handleAddStep}
                  disabled={disabled}
                  className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Add Step
                </button>
              </div>
              
              <div className="space-y-2">
                {selectedProgram.steps.map((step, index) => renderStepDisplay(step, index))}
                
                {selectedProgram.steps.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    No steps added yet. Click "Add Step" to start building your program.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {editingStep && renderStepEditor()}
    </div>
  );
};
