export interface InHeaderTable<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  visible?: boolean;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface TableProps<T> {
  headers: InHeaderTable<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  actions?: (row: T) => React.ReactNode;
  emptyState?: EmptyStateProps;
  classHeader?: string;
  classBody?: string;
}
