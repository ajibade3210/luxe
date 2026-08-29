"use client";

import { Download, MessageSquare, MoreHorizontal, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import type { Customer, CustomersPageProps, Invoice } from "@/types";
import { formatMoney, Metric, PageTitle, useAdminToast } from "./admin-layout";
import { CustomerAddModal } from "./customers/customer-add-modal";
import { CustomerBroadcastModal } from "./customers/customer-broadcast-modal";
import { CustomerDetailDrawer } from "./customers/customer-detail-drawer";
import { CustomerImportModal } from "./customers/customer-import-modal";
import { CustomerMessageModal } from "./customers/customer-message-modal";
import { CustomerResendInvoiceModal } from "./customers/customer-resend-invoice-modal";
import { CustomerServiceModal } from "./customers/customer-service-modal";
import { CustomerTable } from "./customers/customer-table";
import { InvoiceModal } from "./invoices/invoice-modal";

export function CustomersPage({ onToast }: CustomersPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;

  const {
    items,
    selectedCustomer,
    customerInvoices,
    setSelectedCustomerId,
    searchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    paginatedItems,
    totalRevenue,
    activeServicesCount,
    isExporting,
    isSubmitting,
    handleSearch,
    reloadCustomers,
    handleExport,
    handleCreateCustomer,
    handleAddService,
    handleDeleteService,
    handleUpdateServiceStatus,
    handleToggleCustomerStatus,
    handleResendInvoice,
    handleDeleteDraftInvoice,
  } = useCustomers(notify);

  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [confirmResendInvoice, setConfirmResendInvoice] = useState<Invoice | null>(null);

  // Selection helpers
  const activeCustomers = items.filter(c => c.isActive);

  const handleToggleSelectCustomer = (id: string) => {
    setSelectedCustomerIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllActiveCustomers = () => {
    const allActiveSelected =
      activeCustomers.length > 0 && activeCustomers.every(c => selectedCustomerIds.includes(c.id));

    if (allActiveSelected) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(activeCustomers.map(c => c.id));
    }
  };

  const handleClearCustomerSelection = () => {
    setSelectedCustomerIds([]);
  };

  const handleOpenBroadcastModal = () => {
    if (selectedCustomerIds.length === 0) {
      // Default to all active customers if none explicitly checked
      setSelectedCustomerIds(activeCustomers.map(c => c.id));
    }
    setShowBroadcastModal(true);
  };

  // Customers targeted by broadcast
  const broadcastTargetCustomers = items.filter(
    c => selectedCustomerIds.includes(c.id) && c.isActive
  );

  // Invoice Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceModalCustomer, setInvoiceModalCustomer] = useState<Customer | undefined>(undefined);
  const [invoiceModalInvoice, setInvoiceModalInvoice] = useState<Invoice | undefined>(undefined);

  const handleOpenInvoiceModalForCustomer = (customer: Customer, existing?: Invoice) => {
    setInvoiceModalCustomer(customer);
    setInvoiceModalInvoice(existing);
    setShowInvoiceModal(true);
  };

  return (
    <section className="content">
      <PageTitle
        title="Customers"
        action={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-[#191c1d] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Customer</span>
            </button>

            {/* More Actions Menu Button & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoreMenu(prev => !prev)}
                className="inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#ded5c8] hover:border-[#855e2e] rounded-xl transition-all cursor-pointer shadow-2xs"
                title="More actions"
              >
                <MoreHorizontal size={15} />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#ded7cb] rounded-2xl shadow-xl z-30 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        handleOpenBroadcastModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] hover:text-[#855e2e] transition-colors cursor-pointer text-left"
                    >
                      <MessageSquare size={14} className="text-[#855e2e]" />
                      <span>Broadcast</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        setShowImportModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] hover:text-[#855e2e] transition-colors cursor-pointer text-left"
                    >
                      <Upload size={14} className="text-[#855e2e]" />
                      <span>Import</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        handleExport();
                      }}
                      disabled={isExporting}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] hover:text-[#855e2e] transition-colors cursor-pointer text-left disabled:opacity-50"
                    >
                      <Download
                        size={14}
                        className={`text-[#855e2e] ${isExporting ? "animate-bounce" : ""}`}
                      />
                      <span>{isExporting ? "Exporting..." : "Export"}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        }
      />

      <div className="metrics">
        <Metric
          label="Total customers"
          value={String(items.length).padStart(2, "0")}
          detail="Active relationships"
        />
        <Metric
          label="Active services"
          value={String(activeServicesCount).padStart(2, "0")}
          detail="In progress"
        />
        <Metric label="Revenue" value={formatMoney(totalRevenue)} detail="Across all services" />
      </div>

      <CustomerTable
        items={items}
        paginatedItems={paginatedItems}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onSelectCustomer={setSelectedCustomerId}
        selectedCustomerIds={selectedCustomerIds}
        onToggleSelect={handleToggleSelectCustomer}
        onSelectAllActive={handleSelectAllActiveCustomers}
        onClearSelection={handleClearCustomerSelection}
        onOpenBroadcast={handleOpenBroadcastModal}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        startIndex={startIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <CustomerDetailDrawer
        customer={selectedCustomer}
        customerInvoices={customerInvoices}
        onClose={() => setSelectedCustomerId(null)}
        onToggleStatus={handleToggleCustomerStatus}
        onOpenMessageModal={() => setShowSendMessageModal(true)}
        onOpenInvoiceModal={handleOpenInvoiceModalForCustomer}
        onOpenAddServiceModal={() => setShowAddServiceModal(true)}
        onConfirmResendInvoice={setConfirmResendInvoice}
        onDeleteDraftInvoice={handleDeleteDraftInvoice}
        onDeleteService={handleDeleteService}
        onUpdateServiceStatus={handleUpdateServiceStatus}
      />

      <CustomerAddModal
        isOpen={showAddModal}
        isSubmitting={isSubmitting}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateCustomer}
      />

      <CustomerBroadcastModal
        isOpen={showBroadcastModal}
        selectedCustomers={broadcastTargetCustomers}
        onClose={() => setShowBroadcastModal(false)}
        onToast={notify}
      />

      <CustomerServiceModal
        isOpen={showAddServiceModal}
        customer={selectedCustomer}
        onClose={() => setShowAddServiceModal(false)}
        onSubmit={handleAddService}
      />

      <CustomerMessageModal
        isOpen={showSendMessageModal}
        customer={selectedCustomer}
        onClose={() => setShowSendMessageModal(false)}
        onToast={notify}
      />

      <CustomerResendInvoiceModal
        invoice={confirmResendInvoice}
        onClose={() => setConfirmResendInvoice(null)}
        onConfirm={handleResendInvoice}
      />

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setInvoiceModalCustomer(undefined);
          setInvoiceModalInvoice(undefined);
        }}
        onToast={notify}
        initialCustomer={invoiceModalCustomer}
        existingInvoice={invoiceModalInvoice}
        allCustomers={items}
      />

      <CustomerImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onToast={notify}
        onImportSuccess={reloadCustomers}
      />
    </section>
  );
}
