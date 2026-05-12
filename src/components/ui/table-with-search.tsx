import * as React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * TableWithSearch
 * Drop-in replacement for <Table> that adds:
 *  - A search input above the table (right-aligned)
 *  - Pagination + page-size selector below the table
 *
 * Rows whose key starts with "__" (e.g. totals/footers) are always kept
 * and excluded from pagination counting.
 */

function getNodeText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join(" ");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return getNodeText(props.children);
  }
  return "";
}

function processTableBody(
  body: React.ReactElement,
  query: string,
  pageSize: number,
  page: number,
): { element: React.ReactElement; total: number } {
  const bodyProps = body.props as { children?: React.ReactNode };
  const children = React.Children.toArray(bodyProps.children);

  const pinned: React.ReactNode[] = [];
  const dataRows: React.ReactNode[] = [];

  children.forEach((child) => {
    if (!React.isValidElement(child)) {
      dataRows.push(child);
      return;
    }
    const key = String(child.key ?? "");
    if (key.startsWith("__")) {
      pinned.push(child);
    } else {
      dataRows.push(child);
    }
  });

  // Filter
  const q = query.trim().toLowerCase();
  const filtered = q
    ? dataRows.filter((child) => {
        if (!React.isValidElement(child)) return true;
        const text = getNodeText(child).toLowerCase();
        return text.includes(q);
      })
    : dataRows;

  const total = filtered.length;

  // Empty state
  if (total === 0) {
    return {
      element: React.cloneElement(body, undefined, [
        <tr key="__empty">
          <td
            colSpan={99}
            className="text-center text-sm text-muted-foreground py-8"
          >
            No matching records found.
          </td>
        </tr>,
        ...pinned,
      ]),
      total: 0,
    };
  }

  // Paginate
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    element: React.cloneElement(body, undefined, [...paged, ...pinned]),
    total,
  };
}

export interface TableWithSearchProps
  extends React.HTMLAttributes<HTMLTableElement> {
  searchPlaceholder?: string;
  hideSearch?: boolean;
  hidePagination?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export const TableWithSearch = React.forwardRef<
  HTMLTableElement,
  TableWithSearchProps
>(
  (
    {
      children,
      searchPlaceholder = "Search table...",
      hideSearch,
      hidePagination,
      defaultPageSize = 10,
      pageSizeOptions = [10, 20, 50, 100],
      ...rest
    },
    ref,
  ) => {
    const [query, setQuery] = React.useState("");
    const [pageSize, setPageSize] = React.useState(defaultPageSize);
    const [page, setPage] = React.useState(1);

    // Reset to page 1 when query or page size changes
    React.useEffect(() => {
      setPage(1);
    }, [query, pageSize]);

    let total = 0;
    const transformed = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const type = child.type as { displayName?: string } | string;
      const name =
        typeof type === "string"
          ? type
          : (type as { displayName?: string })?.displayName;
      if (name === "TableBody" || name === "tbody") {
        const result = processTableBody(
          child as React.ReactElement,
          query,
          hidePagination ? Number.MAX_SAFE_INTEGER : pageSize,
          page,
        );
        total = result.total;
        return result.element;
      }
      return child;
    });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, total);

    // Build compact page numbers (max 5 visible)
    const pageNumbers: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    startPage = Math.max(1, endPage - maxVisible + 1);
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    return (
      <div className="space-y-2">
        {!hideSearch && (
          <div className="flex justify-end">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder ?? "Search"}
                className="pl-8 h-9 bg-background"
              />
            </div>
          </div>
        )}
        <Table ref={ref} {...rest}>
          {transformed}
        </Table>
        {!hidePagination && (
          <div className="flex items-center justify-between gap-2 pt-2 text-sm">
            <div className="flex items-center">
              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger className="h-9 w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((opt) => (
                    <SelectItem key={opt} value={String(opt)}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-muted-foreground">
              Showing {startItem} - {endItem} of {total}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {pageNumbers.map((n) => (
                <Button
                  key={n}
                  variant={n === currentPage ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  },
);
TableWithSearch.displayName = "TableWithSearch";
