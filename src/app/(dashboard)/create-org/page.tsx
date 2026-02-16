import { CreateOrganization } from '@clerk/nextjs'

export default function CreateOrg() {
  return <CreateOrganization afterCreateOrganizationUrl={'/organization/:id'} />
}
