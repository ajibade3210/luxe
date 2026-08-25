"use client";

import { ArrowRight, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { customers } from "@/lib/mock-data";
import { formatMoney, formatStatusLabel, Metric, PageTitle } from "./admin-layout";

export function CustomersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedCustomer = customers.find(c => c.id === selected);

  return (
    <section className="content">
      <PageTitle
        eyebrow="Client relationships"
        title="Customers"
        description="The people behind the remarkable moments."
      />
      <div className="metrics">
        <Metric label="Total customers" value="03" detail="Active relationships" />
        <Metric label="Active projects" value="02" detail="In progress" />
        <Metric
          label="Revenue"
          value={formatMoney(customers.reduce((a, c) => a + c.totalRevenue, 0))}
          detail="Across all projects"
        />
      </div>
      <div className="table-card">
        <div className="table-head">
          <h2>All customers</h2>
          <span>{customers.length} records</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Project</th>
                <th>Value</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {customers.map(c => {
                const p = c.projects[0];
                return (
                  <tr key={c.id} onClick={() => setSelected(c.id)}>
                    <td>
                      <b>{c.name}</b>
                      <small>{c.email}</small>
                    </td>
                    <td>
                      {p.name}
                      <small>{p.service}</small>
                    </td>
                    <td>{formatMoney(c.totalRevenue)}</td>
                    <td>
                      <span className={`status ${p.status}`}>{formatStatusLabel(p.status)}</span>
                    </td>
                    <td>
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedCustomer && (
        <div className="drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="drawer" onClick={e => e.stopPropagation()}>
            <button
              className="drawer-close"
              onClick={() => setSelected(null)}
              aria-label="Close customer details"
            >
              <X />
            </button>
            <span className="eyebrow">Customer details</span>
            <h2>{selectedCustomer.name}</h2>
            <p className="drawer-email">
              {selectedCustomer.email}
              {selectedCustomer.phone ? ` · ${selectedCustomer.phone}` : ""}
            </p>
            {selectedCustomer.company && (
              <p className="drawer-company">{selectedCustomer.company}</p>
            )}
            <div className="drawer-block">
              <span className="eyebrow">Projects</span>
              {selectedCustomer.projects.map(project => (
                <div className="drawer-project" key={project.id}>
                  <div>
                    <b>{project.name}</b>
                    <small>{project.service}</small>
                  </div>
                  <div className="drawer-project-meta">
                    <strong>{formatMoney(project.amount)}</strong>
                    <span className={`status ${project.status}`}>
                      {formatStatusLabel(project.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-block">
              <span className="eyebrow">Client notes</span>
              <p>{selectedCustomer.notes}</p>
            </div>
            <div className="drawer-actions">
              <a
                className="dark-button bg-[#000000] border-[#000000]"
                href={`mailto:${selectedCustomer.email}`}
              >
                Email customer <ArrowRight size={15} />
              </a>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
