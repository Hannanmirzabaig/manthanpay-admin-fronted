export const dynamic = 'force-dynamic';

import KycList from "@/features/kyc/components/KycList";

export default function KycPage() {
  return (
    <main className="w-full min-w-0 px-4 py-6 pb-14 md:px-6">
      <KycList />
    </main>
  );
}
