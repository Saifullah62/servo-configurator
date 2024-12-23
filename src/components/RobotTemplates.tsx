import React from 'react';
import { RobotTemplate } from '../types/servo';

interface RobotTemplatesProps {
  templates: RobotTemplate[];
  selectedTemplate?: RobotTemplate;
  onSelectTemplate: (template: RobotTemplate) => void;
  disabled?: boolean;
}

export const RobotTemplates: React.FC<RobotTemplatesProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  disabled = false,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Robot Templates</h3>

      <div className="grid grid-cols-2 gap-4">
        {templates.map((template) => (
          <button
            key={template.name}
            onClick={() => onSelectTemplate(template)}
            disabled={disabled}
            className={`p-4 rounded-lg border ${
              selectedTemplate?.name === template.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            } text-left`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {template.servos.length} servos
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {template.type}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium">Features:</span>
                <ul className="mt-1 list-disc list-inside text-gray-600">
                  {template.advancedFeatures.positionFeedback && (
                    <li>Position Feedback</li>
                  )}
                  {template.advancedFeatures.torqueControl && (
                    <li>Torque Control</li>
                  )}
                  {template.advancedFeatures.softLimits && (
                    <li>Software Limits</li>
                  )}
                </ul>
              </div>

              <div className="text-sm">
                <span className="font-medium">Patterns:</span>
                <ul className="mt-1 list-disc list-inside text-gray-600">
                  {template.defaultPatterns.map((pattern) => (
                    <li key={pattern.name}>{pattern.name}</li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedTemplate?.name === template.name && (
              <div className="mt-4 text-sm text-blue-600">
                ✓ Selected
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Template Configuration</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Servo Configuration
              </label>
              <div className="mt-1 text-sm text-gray-500">
                {selectedTemplate.servos.map((servo, index) => (
                  <div key={index} className="mb-2">
                    Servo {index + 1}: Channel {servo.channel}, 
                    Initial Position: {servo.initialPosition}°
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Available Patterns
              </label>
              <div className="mt-1 text-sm text-gray-500">
                {selectedTemplate.defaultPatterns.map((pattern, index) => (
                  <div key={index} className="mb-2">
                    {pattern.name}: {pattern.points.length} points
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
