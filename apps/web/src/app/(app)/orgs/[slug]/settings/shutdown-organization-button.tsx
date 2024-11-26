import { getCurrentOrg } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { shutDownOrganization } from "@/http/shutdown-organization";
import { XCircle } from "lucide-react";
import { redirect } from "next/navigation";

export function ShutdownOrganizationButton() {
  async function ShutDownOrganization() {
    "use server";

    const currentOrg = getCurrentOrg();

    await shutDownOrganization({ org: currentOrg! });

    redirect("/");
  }

  return (
    <form action={ShutDownOrganization}>
      <Button type="submit" variant="destructive" className="w-56">
        <XCircle className="mr-2 size-4" />
        Shutdown organization
      </Button>
    </form>
  );
}
