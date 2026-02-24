'use server'

import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { getAbsoluteUrl } from '@/lib/utils'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function checkSubscription() {
  const { orgId } = await auth()
  if (!orgId) return false

  const orgSubscription = await prisma.orgSubscription.findUnique({
    where: { orgId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  })

  if (!orgSubscription) return false

  return !!orgSubscription.stripePriceId
}

export async function checkoutSubscription() {
  const { orgId } = await auth()
  const user = await currentUser()
  if (!orgId || !user) return null

  const settingsUrl = getAbsoluteUrl(`/organization/${orgId}`)
  let url = ''

  const orgSubscription = await prisma.orgSubscription.findUnique({ where: { orgId } })

  if (orgSubscription && orgSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: orgSubscription.stripeCustomerId,
      return_url: settingsUrl,
    })

    url = stripeSession.url
  } else {
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: 'USD',
            product_data: {
              name: 'Taskify Pro',
              description: 'Unlimited boards for your organization',
            },
            unit_amount: 2000,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: { org_id: orgId },
    })

    url = stripeSession.url ?? ''
  }

  revalidatePath(`/organization/${orgId}`)
  return { url }
}
