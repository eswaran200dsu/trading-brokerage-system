import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UploadCloud,
  Loader2,
  FileSpreadsheet,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { uploadClientMaster } from "@/lib/api";
import {
  EXPECTED_HEADERS,
  fileSizeOk,
  parseExcelPreview,
  type SheetPreview,
} from "@/lib/validation";

export const Route = createFileRoute("/admin/upload-client-master")({
  component: () => (
    <UploadCard
      title="Upload Client Master"
      description="Upload an Excel sheet (.xlsx) of clients."
      expected={EXPECTED_HEADERS.clientMaster}
      action={uploadClientMaster}
    />
  ),
});

export function UploadCard({
  title,
  description,
  expected,
  action,
}: {
  title: string;
  description: string;
  expected: readonly string[];
  action: (file: File) => Promise<{ ok: true; rows: number }>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<SheetPreview | null>(null);
  const [parsing, setParsing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [result, setResult] = useState<{ rows: number; fileName: string } | null>(null);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setFileError(null);
    setResult(null);
  };

  const onFile = async (f: File | null) => {
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
      setFileError(`Could not read file: ${(e as Error).message}`);
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
      setResult({ rows: r.rows, fileName: file.name });
      toast.success(`Uploaded ${r.rows} rows from ${file.name}`);
      setFile(null);
      setPreview(null);
    } catch (e) {
      toast.error((e as Error).message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-1.5 pt-2">
          {expected.map((h) => (
            <Badge key={h} variant="secondary" className="font-mono text-xs">
              {h}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <Alert className="border-emerald-500/40 bg-emerald-500/5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle>Upload successful</AlertTitle>
            <AlertDescription>
              Processed {result.rows} rows from <span className="font-medium">{result.fileName}</span>.
            </AlertDescription>
          </Alert>
        )}

        <label className="block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors">
          <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">Click to choose an Excel file</p>
          <p className="text-xs text-muted-foreground">.xlsx only • max 10MB</p>
          <Input
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>

        {fileError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fileError}</AlertDescription>
          </Alert>
        )}

        {file && (
          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/40">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{file.name}</div>
              <div className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
                {preview && ` • ${preview.totalRows} rows`}
                {parsing && " • parsing…"}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {preview && (
          <>
            {preview.missingHeaders.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Missing required columns</AlertTitle>
                <AlertDescription>
                  Add these columns to your sheet:{" "}
                  <span className="font-mono">{preview.missingHeaders.join(", ")}</span>
                </AlertDescription>
              </Alert>
            )}
            {preview.extraHeaders.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unrecognized columns will be ignored:{" "}
                  <span className="font-mono">{preview.extraHeaders.join(", ")}</span>
                </AlertDescription>
              </Alert>
            )}

            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Preview (first {preview.rows.length} rows)
              </div>
              <div className="overflow-x-auto border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {preview.headers.map((h) => (
                        <TableHead key={h} className="whitespace-nowrap text-xs">
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.rows.map((r, i) => (
                      <TableRow key={i}>
                        {preview.headers.map((h) => (
                          <TableCell key={h} className="whitespace-nowrap text-xs">
                            {String(r[h] ?? "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}

        <Button onClick={onUpload} disabled={!canUpload}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}
