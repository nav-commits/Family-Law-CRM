import { TimeTrackingOverview } from '../../features/time-tracking/time-tracking-overview';
import { TimeEntryList } from '../../features/time-tracking/time-entry-list';
import { TimeEntryForm } from '../../features/time-tracking/time-entry-form';

export default function TimeTrackingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1> 
      <TimeTrackingOverview /> 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TimeEntryList />
        </div>
        <div>
          <TimeEntryForm />
        </div>
      </div>
    </div>
  );
}