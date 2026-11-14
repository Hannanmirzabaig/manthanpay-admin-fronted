// "use client";

// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useKycRecord } from "../hooks/useKyc";
// import SelfieImageViewer from "./SelfieImageViewer";
// import {
//   displayValue,
//   formatDate,
//   maskAadhaar,
//   maskBankAccount,
//   maskMobile,
//   maskPan,
// } from "../utils/kycFormatters";

// function DetailSection({ title, children }) {
//   return (
//     <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//       <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
//         <h2 className="font-semibold text-slate-800">{title}</h2>
//       </div>
//       <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
//         {children}
//       </div>
//     </section>
//   );
// }

// function DetailField({ label, value }) {
//   return (
//     <div className="min-w-0">
//       <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
//         {label}
//       </p>
//       <p className="break-words text-sm font-medium text-slate-800">
//         {displayValue(value)}
//       </p>
//     </div>
//   );
// }

// export default function KycDetails() {
//   const params = useParams();
//   const id = params?.id;
//   const { record, loading, error } = useKycRecord(id);

//   if (loading) {
//     return (
//       <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
//         Loading KYC details...
//       </div>
//     );
//   }

//   if (error || !record) {
//     return (
//       <div className="rounded-xl border border-red-200 bg-white p-8">
//         <p className="text-sm text-red-700">
//           {error || "KYC record not found."}
//         </p>
//         <Link
//           href="/dashboard/kyc"
//           className="mt-4 inline-block text-sm font-semibold text-blue-800 underline"
//         >
//           Back to KYC list
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-w-0 space-y-5">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <Link
//             href="/dashboard/kyc"
//             className="text-sm font-medium text-blue-800 hover:underline"
//           >
//             â† Back to KYC list
//           </Link>
//           <h1 className="mt-3 text-2xl font-bold text-slate-900">
//             KYC Details
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Retailer: {displayValue(record.retailerId)} Â· {displayValue(record.retailerName)}
//           </p>
//         </div>
//         <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
//           Record ID: {displayValue(record.id)}
//         </span>
//       </div>

//       <DetailSection title="Personal Information">
//         <DetailField label="Retailer ID" value={record.retailerId} />
//         <DetailField label="Retailer Name" value={record.retailerName} />
//         <DetailField label="Mobile Number" value={maskMobile(record.mobileNo)} />
//         <DetailField label="PAN Number" value={maskPan(record.panNo)} />
//         <DetailField label="Aadhaar Number" value={maskAadhaar(record.aadharNo)} />
//       </DetailSection>

//       <DetailSection title="Verification Details">
//         <DetailField label="Aadhaar Verification" value={record.aadhaarVerification} />
//         <DetailField label="Video KYC" value={record.videoKyc} />
//         <DetailField label="PAN Verification" value={record.panVerification} />
//         <DetailField label="Face Matched API Response" value={record.apiResponceFaceMatched} />
//         <DetailField label="Face Liveness API Response" value={record.apiResponceFaceLiveness} />
//         <DetailField label="Aadhaar eSign" value={record.aadhaarEsign} />
//       </DetailSection>

//       <DetailSection title="Documents">
//         <div>
//           <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Selfie Image</p>
//           <SelfieImageViewer recordId={record.id} />
//         </div>

//         <div>
//           <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Shop Image</p>
//           <SelfieImageViewer recordId={record.id} endpoint="shop-image" title="Shop Image" />
//         </div>

//         <div>
//           <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">POI</p>
//           <SelfieImageViewer recordId={record.id} endpoint="poi" title="POI Document" />
//         </div>

//         <div>
//           <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">POA</p>
//           <SelfieImageViewer recordId={record.id} endpoint="poa" title="POA Document" />
//         </div>

//         <DetailField label="Other Document" value={record.otherDocument} />
//         <DetailField label="Bank Proof" value={record.bankProof} />
//         <DetailField
//           label="Bank Cheque Document"
//           value={record.bankChequeContentType ? `Available (${record.bankChequeContentType})` : "Not available"}
//         />
//       </DetailSection>

//       <DetailSection title="Bank Details">
//         <DetailField label="Account Holder Name" value={record.bankAccountHolderName} />
//         <DetailField label="Bank Account Number" value={maskBankAccount(record.bankAccountNumber)} />
//         <DetailField label="IFSC Code" value={record.bankIfsc} />
//         <DetailField label="Cheque Content Type" value={record.bankChequeContentType} />
//       </DetailSection>

//       <DetailSection title="Audit Information">
//         <DetailField label="Created Date" value={formatDate(record.createdDate)} />
//         <DetailField label="Updated Date" value={formatDate(record.updatedDate)} />
//         <DetailField label="Updated By" value={record.updatedBy} />
//       </DetailSection>

//       <p className="text-xs text-slate-400">
//         Read-only KYC record. Sensitive identification and bank account values are masked.
//       </p>
//     </div>
//   );
// }

