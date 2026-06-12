import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { toast } from "sonner";
import { C as Card, a as CardHeader, b as CardTitle, l as Badge, c as CardContent, A as Alert, m as AlertTitle, f as AlertDescription, I as Input, B as Button, T as Table, g as TableHeader, h as TableRow, i as TableHead, j as TableBody, k as TableCell, E as EXPECTED_HEADERS, n as fileSizeOk, p as parseExcelPreview } from "./router-7vaADMHT.js";
import { CheckCircle2, UploadCloud, AlertCircle, FileSpreadsheet, X, Loader2 } from "lucide-react";
import { u as uploadClientMaster } from "./api-DVTefHqP.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function UploadCard({
  title,
  description,
  expected,
  action
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [result, setResult] = useState(null);
  const reset = () => {
    setFile(null);
    setPreview(null);
    setFileError(null);
    setResult(null);
  };
  const onFile = async (f) => {
    setResult(null);
    setPreview(null);
    setFileError(null);
    if (!f) {
      setFile(null);
      return;
    }
    const sizeErr = fileSizeOk(f);
    if (sizeErr) {
      setFileError(sizeErr);
      setFile(null);
      return;
    }
    setFile(f);
    setParsing(true);
    try {
      const p = await parseExcelPreview(f, expected);
      setPreview(p);
      if (p.totalRows === 0) setFileError("The file appears to be empty");
    } catch (e) {
      setFileError(`Could not read file: ${e.message}`);
    } finally {
      setParsing(false);
    }
  };
  const headersValid = preview && preview.missingHeaders.length === 0;
  const canUpload = !!file && !!preview && headersValid && !loading;
  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const r = await action(file);
      setResult({
        rows: r.rows,
        fileName: file.name
      });
      toast.success(`Uploaded ${r.rows} rows from ${file.name}`);
      setFile(null);
      setPreview(null);
    } catch (e) {
      toast.error(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "max-w-4xl", children: [
    /* @__PURE__ */ jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsx(CardTitle, { children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 pt-2", children: expected.map((h) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "font-mono text-xs", children: h }, h)) })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      result && /* @__PURE__ */ jsxs(Alert, { className: "border-emerald-500/40 bg-emerald-500/5", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-600" }),
        /* @__PURE__ */ jsx(AlertTitle, { children: "Upload successful" }),
        /* @__PURE__ */ jsxs(AlertDescription, { children: [
          "Processed ",
          result.rows,
          " rows from ",
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: result.fileName }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors", children: [
        /* @__PURE__ */ jsx(UploadCloud, { className: "h-10 w-10 mx-auto text-muted-foreground" }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm font-medium", children: "Click to choose an Excel file" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: ".xlsx only • max 10MB" }),
        /* @__PURE__ */ jsx(Input, { type: "file", accept: ".xlsx", className: "hidden", onChange: (e) => onFile(e.target.files?.[0] ?? null) })
      ] }),
      fileError && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx(AlertDescription, { children: fileError })
      ] }),
      file && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-3 rounded-md bg-muted/40", children: [
        /* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium truncate", children: file.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            (file.size / 1024).toFixed(1),
            " KB",
            preview && ` • ${preview.totalRows} rows`,
            parsing && " • parsing…"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: reset, children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
      ] }),
      preview && /* @__PURE__ */ jsxs(Fragment, { children: [
        preview.missingHeaders.length > 0 && /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx(AlertTitle, { children: "Missing required columns" }),
          /* @__PURE__ */ jsxs(AlertDescription, { children: [
            "Add these columns to your sheet:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: preview.missingHeaders.join(", ") })
          ] })
        ] }),
        preview.extraHeaders.length > 0 && /* @__PURE__ */ jsxs(Alert, { children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxs(AlertDescription, { children: [
            "Unrecognized columns will be ignored:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-mono", children: preview.extraHeaders.join(", ") })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs font-medium text-muted-foreground mb-2", children: [
            "Preview (first ",
            preview.rows.length,
            " rows)"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto border rounded-md", children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsx(TableRow, { children: preview.headers.map((h) => /* @__PURE__ */ jsx(TableHead, { className: "whitespace-nowrap text-xs", children: h }, h)) }) }),
            /* @__PURE__ */ jsx(TableBody, { children: preview.rows.map((r, i) => /* @__PURE__ */ jsx(TableRow, { children: preview.headers.map((h) => /* @__PURE__ */ jsx(TableCell, { className: "whitespace-nowrap text-xs", children: String(r[h] ?? "") }, h)) }, i)) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: onUpload, disabled: !canUpload, children: [
        loading && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
        "Upload"
      ] })
    ] })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(UploadCard, { title: "Upload Client Master", description: "Upload an Excel sheet (.xlsx) of clients.", expected: EXPECTED_HEADERS.clientMaster, action: uploadClientMaster });
export {
  UploadCard,
  SplitComponent as component
};
