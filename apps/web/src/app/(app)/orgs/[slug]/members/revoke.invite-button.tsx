import { ability } from "@/auth/auth";
import { Button } from "@/components/ui/button";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Table, XOctagon } from "lucide-react";
import { revokeInviteAction } from "./actions";

interface RevokeInviteButtonProps {
  inviteId: string;
}

export function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button variant="destructive">
        <XOctagon className="mr-2 size-4" />
        Revoke invite
      </Button>
    </form>
  );
}