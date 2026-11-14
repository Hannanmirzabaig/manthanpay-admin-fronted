import SelfieImageViewer from "./SelfieImageViewer";
import KycRemarkEditor from "./KycRemarkEditor";
import {
  displayValue,
  formatDate,
  maskAadhaar,
  maskBankAccount,
  maskMobile,
  maskPan,
} from "../utils/kycFormatters";

const imageEndpoints = {
  selfieImage: "selfie-image",
  shopImage: "shop-image",
  poi: "poi",
  poa: "poa",
  poi_back: "poi_back",
  poa_back: "poa_back",
};

const documentTitles = {
  selfieImage: "Selfie Image",
  shopImage: "Shop Image",
  poi: "POI",
  poa: "POA",
  poi_back: "POI Back",
  poa_back: "POA Back",
};

const reviewableDocuments = Object.keys(imageEndpoints);

const columns = [
  // { label: "ID", key: "id" },
  { label: "Retailer ID", key: "retailerId" },
  { label: "Retailer Name", key: "retailerName" },
  { label: "Mobile No", key: "mobileNo", format: maskMobile },
  { label: "Aadhar No", key: "aadharNo", format: maskAadhaar },
  { label: "Aadhaar Verification", key: "aadhaarVerification" },
  { label: "PAN No", key: "panNo", format: maskPan },
  { label: "PAN Verification", key: "panVerification" },
  { label: "Bank Account Holder", key: "bankAccountHolderName" },
  { label: "Bank Account Number", key: "bankAccountNumber", format: maskBankAccount },
  { label: "Bank IFSC", key: "bankIfsc" },
  // { label: "Bank Proof", key: "bankProof" },
  {
    label: "Bank Cheque Document",
    key: "bankChequeDocument",
    getValue: (record) => record.bankChequeContentType ? "Available" : "Not Available",
  },
  // { label: "Bank Cheque Content Type", key: "bankChequeContentType" },
  // { label: "Video KYC", key: "videoKyc" },
  { label: "Aadhaar Esign", key: "aadhaarEsign" },
  { label: "Selfie Image", key: "selfieImage" },
  { label: "Shop Image", key: "shopImage" },
  { label: "POI", key: "poi" },
  { label: "POI Back", key: "poi_back" },
  { label: "POA", key: "poa" },
  { label: "POA Back", key: "poa_back" },
  { label: "Other Document", key: "otherDocument" },
  { label: "Created Date", key: "createdDate", format: formatDate },
  { label: "Updated Date", key: "updatedDate", format: formatDate },
  // { label: "Updated By", key: "updatedBy" },
  // { label: "Face Matched", key: "apiResponceFaceMatched" },
  // { label: "Face Liveness", key: "apiResponceFaceLiveness" },
  { label: "Remarks", key: "remarks" },
];

export default function KycTable({ records = [] }) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[3000px] border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap border-b border-slate-200 bg-slate-100 px-4 py-3 font-semibold text-slate-700"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50/70"}
              >
                {columns.map((column) => {
                  const rawValue = column.getValue
                    ? column.getValue(record)
                    : record[column.key];

                  const value = column.format
                    ? column.format(rawValue)
                    : displayValue(rawValue);

                  return (
                    <td
                      key={column.key}
                      title={reviewableDocuments.includes(column.key)
                        ? `View ${documentTitles[column.key]}`
                        : value}
                      className="max-w-[240px] whitespace-nowrap border-b border-slate-100 px-4 py-3 text-slate-600"
                    >
                      {reviewableDocuments.includes(column.key) ? (
                        <SelfieImageViewer
                          recordId={record.id}
                           retailerId={record.retailerId}
                          endpoint={imageEndpoints[column.key]}
                          title={documentTitles[column.key]}
                          enableReview={true}
                        />
                      ) : column.key === "remarks" ? (
                        <KycRemarkEditor
                          recordId={record.id}
                          remarks={rawValue}
                        />
                      ) : (
                        <span className="block max-w-[220px] truncate">
                          {value}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No KYC records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
        Showing {records.length} records · Scroll horizontally to view all columns.
      </div>
    </div>
  );
}