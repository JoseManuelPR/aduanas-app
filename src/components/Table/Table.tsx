import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import type { TableProps } from "./table.types";
import { Icon } from "he-button-custom-library";


export function Table<T extends Record<string, unknown>>({
  headers,
  data,
  loading = false,
  error = null,
  actions,
  emptyState,
  classHeader = "",
  classBody = "",
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (loading) {
    return <div className="p-4 text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (data.length === 0) {
    const {
      title = "No hay datos disponibles",
      description = "No se encontraron registros para mostrar en este momento. Intenta ajustar los filtros o actualizar la página.",
      icon,
    } = emptyState || {};

    return (
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="mb-6 p-4 rounded-full bg-blue-400">
            {icon || (
              <Icon name="Database"
                size={48}
                className="text-gray-100"
              />
            )}
          </div>

          <h3 className="text-sm md:text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          <p className="text-xs md:text-sm text-gray-500 text-center max-w-sm mb-6">
            {description}
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm ">
        <thead className={`bg-gray-50 ${classHeader}`}>
          <tr>
            {headers
              .filter((h) => h.visible !== false)
              .map((header) => (
                <th
                  key={String(header.key)}
                  onClick={() => header.sortable && handleSort(header.key)}
                  className={`border border-red-500px-4 py-3 text-left font-medium text-gray-500 select-none ${header.sortable ? "cursor-pointer" : ""
                    }`}
                >
                  <div className="flex items-center justify-center gap-1">
                   <span className="text-xs md:text-sm uppercase font-medium"> {header.label}</span>
                    {header.sortable && <ArrowUpDown size={14} />}
                  </div>
                </th>
              ))}
            {actions && <th className="px-4 py-2 text-center text-gray-500">Acciones</th>}
          </tr>
        </thead>

        <tbody className={`divide-y divide-gray-200 ${classBody}`}>
          {sortedData.map((row, idx) => (
            <tr key={idx} className={`text-center hover:bg-gray-50 ${idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}`}>
              {headers
                .filter((h) => h.visible !== false)
                .map((header) => (
                  <td key={String(header.key)} className={`px-4 py-2 border border-gray-200/55`}>
                    {header.render ? header.render(row) : String(row[header.key])}
                  </td>
                ))}
              {actions && <td className="px-4 py-2 flex gap-2">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
