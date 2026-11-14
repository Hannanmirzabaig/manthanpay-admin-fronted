import StatCard from "@/components/StatCard";
import { dashboardStats, recentTransactions } from "@/data/dashboardData";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-5 py-8 pb-10 md:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
        <p className="mt-1 text-sm text-slate-500">
          Monitor your ManthanPay operations.
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Sample dashboard data — live backend data is not connected yet.
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
            <p className="mt-1 text-xs text-slate-500">Latest sample activity</p>
          </div>
          <button className="text-sm font-medium text-blue-600">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Transaction ID</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-5 py-4 font-medium text-slate-700">{transaction.id}</td>
                  <td className="px-5 py-4 text-slate-600">{transaction.name}</td>
                  <td className="px-5 py-4 text-slate-600">{transaction.type}</td>
                  <td className="px-5 py-4 font-medium text-slate-700">{transaction.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      transaction.status === "Success"
                        ? "bg-green-50 text-green-700"
                        : transaction.status === "Pending"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
