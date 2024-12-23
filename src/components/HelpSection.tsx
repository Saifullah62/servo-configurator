import React from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpSection({ isOpen, onClose }: HelpSectionProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Servo Motor Calibration Guide</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2">Basic Terms</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium">PWM (Pulse Width Modulation)</dt>
                  <dd className="text-gray-600 ml-4">
                    A control signal that tells the servo where to move. The pulse width
                    (typically 500-2500 microseconds) determines the angle.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Angle Range</dt>
                  <dd className="text-gray-600 ml-4">
                    The physical movement range of your servo (usually 0-180 degrees).
                    Some servos may have mechanical limits preventing full rotation.
                  </dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Configuration Guide</h3>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                <li>
                  <strong>PWM Range:</strong> Adjust these values if your servo doesn't
                  reach its full range. Start with standard values (500-2500µs).
                </li>
                <li>
                  <strong>Speed/Acceleration:</strong> Lower values create smoother
                  movement but slower response. Higher values are faster but may be jerky.
                </li>
                <li>
                  <strong>Center Offset:</strong> Use this to align your servo's center
                  position if it's mechanically off-center.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Movement Patterns</h3>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                <li>Create sequences of positions with specific timing</li>
                <li>Use delays to control movement speed between positions</li>
                <li>Test patterns in simulation before running on hardware</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2">Best Practices</h3>
              <ul className="list-disc ml-6 space-y-2 text-gray-600">
                <li>Always start with simulation mode when testing new configurations</li>
                <li>Save your configurations regularly</li>
                <li>Use presets for commonly used positions</li>
                <li>Test movement patterns at low speeds first</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}