import { createFileRoute } from "@tanstack/react-router";
import { uploadBrokerage } from "@/lib/api";
import { UploadCard } from "./admin.upload-client-master";
import { EXPECTED_HEADERS } from "@/lib/validation";

export const Route = createFileRoute("/admin/upload-brokerage")({
  component: () => (
    <UploadCard
      title="Upload Brokerage"
      description="Upload daily or monthly brokerage Excel."
      expected={EXPECTED_HEADERS.brokerage}
      action={uploadBrokerage}
    />
  ),
});
