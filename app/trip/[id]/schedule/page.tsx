import { notFound } from 'next/navigation';

import ScheduleClient from '@/components/schedule/ScheduleClient';
import { ScheduleProvider } from '@/components/schedule/ScheduleContext';
import { getScheduleData } from '@/components/schedule/lib/schedule';

type SchedulePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SchedulePage({ params }: SchedulePageProps) {
  const { id: tripId } = await params;

  try {
    const scheduleData = await getScheduleData(tripId);

    return (
      <ScheduleProvider initialData={scheduleData}>
        <div className="container mx-auto p-6">
          <ScheduleClient />
        </div>
      </ScheduleProvider>
    );
  } catch (error) {
    console.error('Failed to load schedule:', error);
    notFound();
  }
}