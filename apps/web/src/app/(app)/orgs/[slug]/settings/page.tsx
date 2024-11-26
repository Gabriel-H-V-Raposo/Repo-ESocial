import { ability, getCurrentOrg } from "@/auth/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrganizationForm } from "../../organization-form";
import { ShutdownOrganizationButton } from "./shutdown-organization-button";
import { getOrg } from "@/http/get-org";

export default async function Settings() {
  const currentOrg = getCurrentOrg();
  const permissions = await ability();

  const canUpdateOrganization = permissions?.can("update", "Organization");
  const canGetBilling = permissions?.can("get", "Billing");
  const canShutDownOrganization = permissions?.can("delete", "Organization");

  const { organization } = await getOrg(currentOrg!);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        {canUpdateOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Organization settings</CardTitle>
              <CardDescription>
                Update your organization details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationForm
                isUpdating
                initialData={{
                  domain: organization.domain,
                  name: organization.name,
                  shouldAttachUserByDomain:
                    organization.shouldAttachUserByDomain,
                }}
              />
            </CardContent>
          </Card>
        )}

        {canGetBilling && <div>Billing</div>}

        {canShutDownOrganization && (
          <Card>
            <CardHeader>
              <CardTitle>Shutdown organization</CardTitle>
              <CardDescription>
                This will deleta all organization data including all projects.
                You cannot undo this action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShutdownOrganizationButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
