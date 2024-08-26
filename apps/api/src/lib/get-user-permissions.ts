import { defineAbilitiesFor, Role, userSchema } from "@saas/auth";

export function getUserPermissions(id: string, role: Role) {
  const authUser = userSchema.parse({
    id,
    role,
  });

  const ability = defineAbilitiesFor(authUser);

  return ability;
}
