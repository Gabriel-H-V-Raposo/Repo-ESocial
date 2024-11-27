import { ability, getCurrentOrg } from "@/auth/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getInvites } from "@/http/get-invites";
import { Crown, XOctagon } from "lucide-react";
import { RevokeInviteButton } from "./revoke.invite-button";
import { CreateInviteForm } from "./create-invite-form";

export async function Invites() {
  const currentOrg = getCurrentOrg();
  const permission = await ability();
  const { invites } = await getInvites(currentOrg!);

  return (
    <div className="space-y-4">
      {permission?.can("create", "Invite") && (
        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateInviteForm />
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Invites</h2>

        <div className="rounded border">
          <Table>
            <TableBody>
              {invites.map((invite) => {
                return (
                  <TableRow key={invite.id}>
                    <TableCell className="py-2.5">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">
                          {invite.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">{invite.role}</TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex justify-end">
                        {permission?.can("delete", "Invite") && (
                          <RevokeInviteButton inviteId={invite.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {invites.length == 0 && (
                <TableRow>
                  <TableCell className="text-center text-muted-foreground">
                    No invites found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
