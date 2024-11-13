import { fastify } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createAccount } from "./routes/auth/create-account";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password";
import { getProfile } from "./routes/auth/get-profile";
import { errorHandler } from "./error-handler";
import { requestPasswordRecover } from "./routes/auth/request-password-recover";
import { resetPassword } from "./routes/auth/reset-password";
import { authenticateWithGithub } from "./routes/auth/authenticate-with-github";
import { env } from "@saas/env";
import { createOrganization } from "./routes/orgs/crete-organization";
import { getMembership } from "./routes/orgs/get-membership";
import { getOrganization } from "./routes/orgs/get-organization";
import { getOrganizations } from "./routes/orgs/get-organizations";
import { updateOrganization } from "./routes/orgs/update-organization";
import { shutdownOrganization } from "./routes/orgs/shutdown-organization";
import { transferOrganization } from "./routes/orgs/transfer-organization";
import { createProject } from "./routes/projects/create-project";
import { deleteProject } from "./routes/projects/delete-project";
import { getProject } from "./routes/projects/get-project";
import { getProjects } from "./routes/projects/get-projects";
import { updateProject } from "./routes/projects/update-project";
import { getMembers } from "./routes/members/get-members";
import { updateMember } from "./routes/members/update-member";
import { removeMember } from "./routes/members/remove-member";
import { createInvite } from "./routes/invites/create-invite";
import { getInvite } from "./routes/invites/get-invite";
import { getInvites } from "./routes/invites/get-invites";
import { acceptInvite } from "./routes/invites/accept-invite";
import { rejectInvite } from "./routes/invites/reject-invite";
import { revokeInvite } from "./routes/invites/revoke-invite";
import { getPendingInvites } from "./routes/invites/get-pending-invites";
import { getOrganizationBilling } from "./routes/billing/get-organization-billing";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "BjSolutions API ESocial",
      description: "Api for managing organizations and projects",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(fastifyCors);

//Auth
app.register(createAccount);
app.register(authenticateWithPassword);
app.register(getProfile);
app.register(requestPasswordRecover);
app.register(resetPassword);
app.register(authenticateWithGithub);

//Orgs
app.register(createOrganization);
app.register(getMembership);
app.register(getOrganization);
app.register(getOrganizations);
app.register(updateOrganization);
app.register(shutdownOrganization);
app.register(transferOrganization);

//Projects
app.register(createProject);
app.register(getProject);
app.register(getProjects);
app.register(updateProject);
app.register(deleteProject);

//Members
app.register(getMembers);
app.register(updateMember);
app.register(removeMember);

//Invites
app.register(createInvite);
app.register(getInvite);
app.register(getInvites);
app.register(acceptInvite);
app.register(rejectInvite);
app.register(revokeInvite);
app.register(getPendingInvites);

//Billing
app.register(getOrganizationBilling);

// Token para testes: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMDFhMGY4My0wMGU3LTRiYzktODg4Yi1mNDRhYTNkZTU5Y2MiLCJpYXQiOjE3MjQ2OTY0MTksImV4cCI6MTcyNTMwMTIxOX0.2KqxedQDynvEbVYXUIPdopGg9UI8a2OrbK0x-CjhnNI

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`Server is running on port ${env.SERVER_PORT}`);
});
