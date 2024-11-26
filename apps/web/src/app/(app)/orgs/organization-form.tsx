"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFormState } from "@/hooks/use-form-state";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  createOrganizationAction,
  OrganizationSchema,
  updateOrganizationAction,
} from "./actions";

interface organizationFormProps {
  isUpdating?: boolean;
  initialData?: OrganizationSchema;
}

export function OrganizationForm({
  isUpdating = false,
  initialData,
}: organizationFormProps) {
  const formAction = isUpdating
    ? updateOrganizationAction
    : createOrganizationAction;
  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(formAction);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success == true && message && (
        <Alert variant="success">
          <AlertTriangle className="size-4" />
          <AlertTitle>Success !!!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="email">Organization Name</Label>
        <Input defaultValue={initialData?.name} name="name" id="name" />
        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="domain">E-mail domain</Label>
        <Input
          defaultValue={initialData?.domain ?? "undefined"}
          name="domain"
          type="text"
          id="domain"
          inputMode="url"
          placeholder="exemplo.com"
        />
        {errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.domain[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <div className="items-top flex space-x-2">
          <Checkbox
            defaultChecked={initialData?.shouldAttachUserByDomain}
            id="shouldAttachUsersByDomain"
            name="shouldAttachUsersByDomain"
          />
          <div className="grid gap-1.5 leading-none">
            <label htmlFor="shouldAttachUsersByDomain" className="space-y-1">
              Auto-join new members
            </label>
            <p className="text-sm text-muted-foreground">
              This will automatically invite all members with same e-mail domain
              to this organization
            </p>
          </div>
          {errors?.shouldAttachUserByDomain && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.shouldAttachUserByDomain[0]}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Save organization"
        )}
      </Button>
    </form>
  );
}
