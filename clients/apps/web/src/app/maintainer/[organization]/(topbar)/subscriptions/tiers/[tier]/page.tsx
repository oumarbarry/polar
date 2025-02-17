import SubscriptionTierEditPage from '@/components/Subscriptions/SubscriptionTierEditPage'
import { getServerSideAPI } from '@/utils/api/serverside'
import { Platforms } from '@polar-sh/sdk'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { organization: string; tier: string }
}): Promise<Metadata> {
  return {
    title: `${params.organization}`, // " | Polar is added by the template"
  }
}

export default async function Page({
  params,
}: {
  params: { organization: string; tier: string }
}) {
  const api = getServerSideAPI()
  const organization = await api.organizations.lookup({
    organizationName: params.organization,
    platform: Platforms.GITHUB,
  })

  return (
    <SubscriptionTierEditPage organization={organization} tier={params.tier} />
  )
}
