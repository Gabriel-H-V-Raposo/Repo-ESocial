import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import { z } from "zod";
import { User } from "./models/user";
import { permissions } from "./permissions";
import { userSubject } from "./subject/user";
import { projectSubject } from "./subject/project";
import { organizationSubject } from "./subject/organization";
import { inviteSubject } from "./subject/invite";
import { billingSubject } from "./subject/billing";

export * from "./models/user";
export * from "./models/project";
export * from "./models/organization";
export * from "./roles";

const appAbilitiesSchema = z.union([
  userSubject,
  projectSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilitiesFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== "function") {
    throw new Error(`Invalid role: ${user.role}`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}
